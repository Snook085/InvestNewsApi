import puppeteer from "puppeteer";
import fs from 'node:fs';

const url = 'https://br.cointelegraph.com/tags/bitcoin';

async function main() {
    const browser = await puppeteer.launch({ headless: true,args: [
        '--no-sandbox',
        '--disable-setuid-sandbox'
      ] });
    const page = await browser.newPage();
    
    await page.goto(url);

    async function waitForTimeout(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    await waitForTimeout(7000)
    async function scrollToBottom() {
        let previousHeight = 0;
        let currentHeight = 0;
        let scrollCount = 0; 
    
        while (true) {
            
            previousHeight = currentHeight;
    
           
            await page.evaluate(() => window.scrollBy(0, 500));
    
            
            await waitForTimeout(500);
    
            
            currentHeight = await page.evaluate(() => document.body.scrollHeight);
    
            
            if (currentHeight === previousHeight) {
                scrollCount++;
            } else {
                scrollCount = 0; 
            }
    
           
            if (scrollCount > 5) {  
                break;
            }
        }
    }

    
    await scrollToBottom();

    
    
    await page.waitForSelector('.lazy-image img', { timeout: 5000 });

    const posts = await page.evaluate(() => {
        const posts = Array.from(document.querySelectorAll('[data-testid="posts-listing__item"]'));
        
        return posts.map(post => {
            const coverDiv = post.querySelector('.post-card-inline__cover');

            
            const link = post.querySelector('.post-card-inline__figure-link') || null
            const divCardcontent =  post.querySelector('.post-card-inline__content')

            const divHeardeCard = divCardcontent ? divCardcontent.querySelector('.post-card-inline__header'):null

            

            const paragraph = divCardcontent ? divCardcontent.querySelector('.post-card-inline__text'):null


            const title = divHeardeCard ? divHeardeCard.querySelector('.post-card-inline__title'):null

            const imgElement = coverDiv ? coverDiv.querySelector('img') : null;
            const imgLink = imgElement ? imgElement.src : null;

            return {
                id:Math.floor(Math.random() * 99999),
                title: title.innerHTML,
                img: imgLink,
                desc:paragraph.innerHTML,
                link:link.href
            };
        });
    });

    
    async function salvadados(data) {
        const convert = JSON.stringify(data, null, 2);
        fs.writeFileSync('./Bitcoins.json', convert);
    }
    
    console.log(posts)
    salvadados(posts);
    
    
    await browser.close();
}

main();

export default main;
