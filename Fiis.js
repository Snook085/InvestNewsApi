import puppeteer from "puppeteer";
import fs from 'node:fs';

const url = 'https://fiis.com.br/noticias/page/2/';

async function Fiis() {
    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();
    
    await page.goto(url);

    async function waitForTimeout(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    await waitForTimeout(4000)
    async function scrollToBottom() {
        let previousHeight = 0;
        let currentHeight = 0;
        let scrollCount = 0; 
    
        while (true) {
            
            previousHeight = currentHeight;
    
           
            await page.evaluate(() => window.scrollBy(0, 800));
    
            
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

    
    
    await page.waitForSelector('.loopNoticias', { timeout: 5000 });

    const posts = await page.evaluate(() => {
        const posts = Array.from(document.querySelectorAll('.loopNoticias'));
        
        return posts.map(post => {
            const coverDiv = post.querySelector('img');

            
            const link = post.querySelector('a') || null
            const divCardcontent =  post.querySelector('.loopNoticias__content')


            const title = divCardcontent ? divCardcontent.querySelector('h3'):null

            
            const imgLink = coverDiv ? coverDiv.src : null;

            return {
                id: Math.floor(Math.random() * 99999),
                title: title.innerHTML,
                img: imgLink,
                link:link.href
            };
        });
    });

    
    async function salvadados(data) {
        const convert = JSON.stringify(data, null, 2);
        fs.writeFileSync('./Fiis.json', convert);
    }
    
    console.log(posts)
    salvadados(posts);
    
    
    await browser.close();
}

Fiis();

export default Fiis;
