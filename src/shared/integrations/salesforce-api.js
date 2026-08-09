/**
 * Salesforce REST API Integration
 * 
 * Provides methods to interact with Salesforce objects via REST API
 * Use this for operations that are time-consuming or inaccessible via UI (e.g., Shadow DOM fields)
 * 
 * Authentication: Uses session cookie from UI automation (storageState)
 * 
 * @see https://developer.salesforce.com/docs/atlas.en-us.api_rest.meta/api_rest/intro_rest.htm
 */

const axios = require('axios');
const logger = require('../../../utils/logger');

class SalesforceAPI {
  constructor(baseUrl, sessionId) {
    this.baseUrl = baseUrl.replace(/\/$/, ''); // Remove trailing slash
    this.sessionId = sessionId;
    this.apiVersion = 'v57.0'; // Salesforce API version
    
    this.client = axios.create({
      baseURL: `${this.baseUrl}/services/data/${this.apiVersion}`,
      headers: {
        'Authorization': `Bearer ${sessionId}`,
        'Content-Type': 'application/json'
      }
    });
  }

  /**
   * Create a Salesforce record via API
   * @param {string} objectType - Salesforce object type (e.g., 'QuoteLineItem')
   * @param {object} data - Record data
   * @returns {Promise<{id: string, success: boolean}>}
   */
  async createRecord(objectType, data) {
    try {
      logger.info(`Creating ${objectType} via API...`, { data });
      const response = await this.client.post(`/sobjects/${objectType}`, data);
      
      logger.info(`✅ ${objectType} created: ${response.data.id}`);
      return response.data;
    } catch (error) {
      logger.error(`❌ Failed to create ${objectType}:`, error.response?.data || error.message);
      throw error;
    }
  }

  /**
   * Update a Salesforce record via API
   * @param {string} objectType - Salesforce object type
   * @param {string} recordId - Record ID
   * @param {object} data - Fields to update
   * @returns {Promise<boolean>}
   */
  async updateRecord(objectType, recordId, data) {
    try {
      logger.info(`Updating ${objectType} ${recordId} via API...`, { data });
      await this.client.patch(`/sobjects/${objectType}/${recordId}`, data);
      
      logger.info(`✅ ${objectType} ${recordId} updated`);
      return true;
    } catch (error) {
      logger.error(`❌ Failed to update ${objectType}:`, error.response?.data || error.message);
      throw error;
    }
  }

  /**
   * Query Salesforce records via SOQL
   * @param {string} soql - SOQL query
   * @returns {Promise<Array>}
   */
  async query(soql) {
    try {
      logger.info(`Executing SOQL query...`, { soql });
      const response = await this.client.get('/query', {
        params: { q: soql }
      });
      
      logger.info(`✅ Query returned ${response.data.records.length} records`);
      return response.data.records;
    } catch (error) {
      logger.error(`❌ Query failed:`, error.response?.data || error.message);
      throw error;
    }
  }

  /**
   * Get Product ID by name (searches with LIKE for partial matches)
   * @param {string} productName - Product name or partial name
   * @returns {Promise<string>} Product2 ID
   */
  async getProductIdByName(productName) {
    // First try exact match
    let soql = `SELECT Id, Name FROM Product2 WHERE Name = '${productName}' LIMIT 1`;
    let records = await this.query(soql);
    
    if (records.length > 0) {
      logger.info(`  ✓ Product found (exact match): ${records[0].Name}`);
      return records[0].Id;
    }
    
    // Try partial match with LIKE
    soql = `SELECT Id, Name FROM Product2 WHERE Name LIKE '%${productName}%' LIMIT 5`;
    records = await this.query(soql);
    
    if (records.length === 0) {
      throw new Error(`Product not found: ${productName}`);
    }
    
    logger.info(`  ✓ Found ${records.length} products matching '${productName}':`);
    records.forEach((r, i) => logger.info(`    [${i}] ${r.Name}`));
    logger.info(`  Using first match: ${records[0].Name}`);
    
    return records[0].Id;
  }

  /**
   * Get PricebookEntry ID for a product in a specific Pricebook
   * @param {string} productId - Product2 ID
   * @param {string} pricebookId - Pricebook2 ID (optional, uses standard if not provided)
   * @returns {Promise<string>} PricebookEntry ID
   */
  async getPricebookEntryId(productId, pricebookId = null) {
    let soql;
    if (pricebookId) {
      soql = `SELECT Id, UnitPrice FROM PricebookEntry WHERE Product2Id = '${productId}' AND Pricebook2Id = '${pricebookId}' AND IsActive = true LIMIT 1`;
    } else {
      // Use standard pricebook
      soql = `SELECT Id, UnitPrice FROM PricebookEntry WHERE Product2Id = '${productId}' AND Pricebook2.IsStandard = true AND IsActive = true LIMIT 1`;
    }
    
    const records = await this.query(soql);
    
    if (records.length === 0) {
      throw new Error(`PricebookEntry not found for Product ID: ${productId}`);
    }
    
    return records[0];
  }

  /**
   * Add Quote Line Item via API (bypasses Shadow DOM UI issues)
   * @param {object} params
   * @param {string} params.quoteId - Quote ID
   * @param {string} params.productName - Product name (e.g., 'ZOOM')
   * @param {number} params.quantity - Quantity
   * @param {number} params.discount - Discount percentage (0-100)
   * @param {string} params.pricebookId - Pricebook ID (optional)
   * @returns {Promise<{id: string, success: boolean}>}
   */
  async addQuoteLineItem({ quoteId, productName, quantity, discount, pricebookId = null }) {
    try {
      logger.info(`🚀 Adding Quote Line Item via API...`, {
        quoteId,
        productName,
        quantity,
        discount
      });

      // Step 1: Get the Quote's Pricebook2Id if not provided
      if (!pricebookId) {
        const quoteQuery = `SELECT Pricebook2Id FROM Quote WHERE Id = '${quoteId}' LIMIT 1`;
        const quoteRecords = await this.query(quoteQuery);
        
        if (quoteRecords.length === 0) {
          throw new Error(`Quote not found: ${quoteId}`);
        }
        
        pricebookId = quoteRecords[0].Pricebook2Id;
        
        if (!pricebookId) {
          // Quote has no Pricebook assigned, get standard Pricebook
          const standardPbQuery = `SELECT Id FROM Pricebook2 WHERE IsStandard = true LIMIT 1`;
          const standardPb = await this.query(standardPbQuery);
          
          if (standardPb.length > 0) {
            pricebookId = standardPb[0].Id;
            logger.info(`  ℹ Quote has no Pricebook, using Standard Pricebook: ${pricebookId}`);
            
            // Update Quote with Pricebook
            await this.updateRecord('Quote', quoteId, { Pricebook2Id: pricebookId });
            logger.info(`  ✓ Quote updated with Pricebook2Id`);
          } else {
            throw new Error('No Pricebook found (standard or assigned to Quote)');
          }
        } else {
          logger.info(`  ✓ Quote is using Pricebook: ${pricebookId}`);
        }
      }

      // Step 2: Get Product ID
      const productId = await this.getProductIdByName(productName);
      logger.info(`  ✓ Product ID: ${productId}`);

      // Step 3: Get PricebookEntry using the Quote's Pricebook
      const pricebookEntry = await this.getPricebookEntryId(productId, pricebookId);
      logger.info(`  ✓ PricebookEntry ID: ${pricebookEntry.Id}, UnitPrice: ${pricebookEntry.UnitPrice}`);

      // Step 4: Create QuoteLineItem
      const quoteLineItemData = {
        QuoteId: quoteId,
        Product2Id: productId,
        PricebookEntryId: pricebookEntry.Id,
        Quantity: quantity,
        UnitPrice: pricebookEntry.UnitPrice,
        Discount: discount
      };

      const result = await this.createRecord('QuoteLineItem', quoteLineItemData);
      
      logger.info(`🎉 Quote Line Item created successfully!`, {
        id: result.id,
        product: productName,
        quantity,
        discount: `${discount}%`
      });

      return result;
    } catch (error) {
      logger.error(`❌ Failed to add Quote Line Item:`, error.message);
      throw error;
    }
  }

  /**
   * Extract session ID from Playwright page cookies
   * @param {import('@playwright/test').Page} page - Playwright page
   * @returns {Promise<string>} Salesforce session ID
   */
  static async getSessionIdFromPage(page) {
    const cookies = await page.context().cookies();
    
    // Try different cookie names used by Salesforce
    const sessionCookieNames = ['sid', 'sid_Client', 'force-stream'];
    
    for (const cookieName of sessionCookieNames) {
      const cookie = cookies.find(c => c.name === cookieName);
      if (cookie && cookie.value) {
        logger.info(`✓ Found Salesforce session cookie: ${cookieName}`);
        return cookie.value;
      }
    }
    
    throw new Error('Salesforce session cookie not found. Ensure you are logged in via UI first.');
  }
}

module.exports = SalesforceAPI;
