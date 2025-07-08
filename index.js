/**
 * Example of using Bright Data's Web Unlocker API with AWS S3 storage
 * This script demonstrates how to make a request to a website through Bright Data Unlocker
 * and store the response in an AWS S3 bucket
 */

const fs = require('fs');
const path = require('path');
require('dotenv').config();

// Configuration - Update these values
const CONFIG = {
  apiToken: process.env.BRIGHT_DATA_API_TOKEN || 'YOUR_API_KEY', 
  zone: process.env.BRIGHT_DATA_ZONE || 'web_unlocker1', 
  targetUrl: 'https://geo.brdtest.com/welcome.txt',
  format: 'json',
  outputDir: 'scraping-output',
  outputFile: 'output.json'
};

/**
 * Makes a request to the Bright Data API
 * @returns {Promise} Promise that resolves with the API response
 */
async function fetchWithBrightData() {
  try {
    if (CONFIG.apiToken === 'YOUR_API_KEY') {
      console.warn('⚠️ Please set your actual API token before making requests');
      throw new Error('API token not configured');
    }
    console.log(`🔄 Fetching ${CONFIG.targetUrl} through Bright Data Unlocker...`);
    const response = await fetch('https://api.brightdata.com/request', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${CONFIG.apiToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        zone: CONFIG.zone,
        url: CONFIG.targetUrl,
        format: CONFIG.format
      })
    });
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const data = await response.json();
    console.log('✅ Request successful!');
    return data;
  } catch (error) {
    console.error('❌ Error fetching data:', error.message);
    throw error;
  }
}

function getTimestampedFilename() {
  const now = new Date();
  const pad = n => n.toString().padStart(2, '0');
  const date = `${now.getFullYear()}${pad(now.getMonth() + 1)}${pad(now.getDate())}`;
  const time = `${pad(now.getHours())}${pad(now.getMinutes())}${pad(now.getSeconds())}`;
  return `output-${date}-${time}.json`;
}

/**
 * Cleans the output directory and writes the scraped data to a single JSON file
 * @param {Object} data - The data to write
 */
function saveOutputLocally(data) {
  try {
    const outputDir = path.resolve(__dirname, CONFIG.outputDir);
    // Ensure output directory exists
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir);
    }
    // Remove all files in the output directory
    fs.readdirSync(outputDir).forEach(file => {
      fs.unlinkSync(path.join(outputDir, file));
    });
    // Write the output file with timestamp
    const outputFile = getTimestampedFilename();
    const outputPath = path.join(outputDir, outputFile);
    fs.writeFileSync(outputPath, JSON.stringify(data, null, 2), 'utf8');
    console.log(`✅ Output saved to ${outputPath}`);
    return outputFile;
  } catch (error) {
    console.error('❌ Error saving output locally:', error.message);
    throw error;
  }
}

/**
 * Main function that orchestrates the scraping and storage process
 */
async function scrapeAndStore() {
  try {
    // Step 1: Fetch data using Bright Data Unlocker
    const scrapedData = await fetchWithBrightData();
    // Step 2: Save output locally with timestamped filename
    const outputFile = saveOutputLocally(scrapedData);
    // Step 3: Display summary
    console.log('\n📊 Summary:');
    console.log(`   Target URL: ${CONFIG.targetUrl}`);
    console.log(`   Output File: ${path.join(CONFIG.outputDir, outputFile)}`);
    console.log(`   Data Size: ${JSON.stringify(scrapedData).length} characters`);
    return {
      scrapedData,
      outputFile: path.join(CONFIG.outputDir, outputFile)
    };
  } catch (error) {
    console.error('❌ Process failed:', error.message);
    process.exit(1);
  }
}

// Execute the main function
scrapeAndStore()
  .then(result => {
    console.log('\n🎉 Process completed successfully!');
  })
  .catch(error => {
    console.error('\n💥 Process failed with error:', error.message);
    process.exit(1);
  });
