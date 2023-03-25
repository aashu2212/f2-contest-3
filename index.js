const puppeteer = require('puppeteer');
const cheerio = require('cheerio');
const fs = require('fs');

async function scrapeTrendingRepos() {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto('https://github.com/trending');

  const html = await page.content();
  const $ = cheerio.load(html);

  const repos = [];

  $('article.Box-row').each((i, el) => {
    const repo = {};

    repo.title = $(el).find('h1 a').text().trim();
    repo.description = $(el).find('p.my-1').text().trim();
    repo.url = `https://github.com${$(el).find('h1 a').attr('href')}`;
    repo.stars = parseInt($(el).find('a.muted-link svg.octicon-star + span').text().trim().replace(',', ''), 10);
    repo.forks = parseInt($(el).find('a.muted-link svg.octicon-repo-forked + span').text().trim().replace(',', ''), 10);
    repo.language = $(el).find('span.d-inline-block.ml-0.mr-3').eq(1).text().trim();

    repos.push(repo);
  });

  await browser.close();

  return repos;
}

async function scrapeTrendingDevelopers() {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto('https://github.com/trending/developers?since=daily&spoken_language_code=en');

  const html = await page.content();
  const $ = cheerio.load(html);

  const developers = [];

  $('article.Box-row').each((i, el) => {
    const developer = {};

    developer.name = $(el).find('h1.h3 a').text().trim();
    developer.username = $(el).find('h1.h3 a').attr('href').replace('/', '');
    developer.topRepoName = $(el).find('h1.h4 a').text().trim();
    developer.topRepoDescription = $(el).find('p.text-gray').text().trim();

    developers.push(developer);
  });

  await browser.close();

  return developers;
}

async function main() {
  const repos = await scrapeTrendingRepos();
  const developers = await scrapeTrendingDevelopers();

  const data = {
    trendingRepos: repos,
    trendingDevelopers: developers,
  };

  fs.writeFile('data.json', JSON.stringify(data, null, 2), (err) => {
    if (err) {
      console.log('Error writing file:', err);
    } else {
      console.log('Data written to file');
    }
  });

  console.log(JSON.stringify(data, null, 2));
}

main();
const filename = './data.json';
try {
    // main code block
  } catch (error) {
    console.error(error);
  }
  