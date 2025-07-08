# Bright Data Unlocker Node.js scheduler example

This project demonstrates how to use Bright Data's Web Unlocker API to scrape web content and store the results in a local JSON file, with automated daily runs using GitHub Actions.

## Features

* Fetch web content through Bright Data's Unlocker API
* Store the scraped data in `scraping-output/output.json` as JSON
* Automated daily scraping and commit via GitHub Actions
* Easy configuration via environment variables

## Prerequisites

* Node.js (v14 or higher recommended)
* A Bright Data account

## Getting Started

### 1. Clone the repository

git clone <your-repo-url>
cd <your-repo-directory>

### 2. Install dependencies

npm install

### 3. Configure environment variables

Copy the example environment file and fill in your credentials:

cp .env.example .env

Then edit the newly created `.env` file and set your actual API keys and configuration values:

* `BRIGHT_DATA_API_TOKEN`: Your Bright Data API token (get it here)
* `BRIGHT_DATA_ZONE`: Your Bright Data Unlocker zone (get it here)

### 4. Run the script manually (optional)

node index.js

## How it Works

* The script fetches the target URL using Bright Data's Unlocker API.
* The response is saved as a JSON file in `scraping-output/output.json`.
* Before each run, the output folder is emptied to ensure only the latest result is stored.

## Automation with GitHub Actions

A GitHub Actions workflow is included to run the scraper once per day automatically. The workflow will:

* Run the scraper daily (at midnight UTC)
* Commit and push the new output to the repository

You can find the workflow file at `.github/workflows/scrape.yml`.

## Customization

* Change the `targetUrl` or `format` in `index.js` or via environment variables as needed.
* Adjust output file name or location in `index.js` if desired.

## About

Scrape web data using Bright Data Unlocker and store in a local JSON file, with daily automation via GitHub Actions.

## License

MIT license
