import puppeteer from "puppeteer"
import fs from 'node:fs'

const url = 'https://br.investing.com/crypto/bitcoin/news'


async function main(){
    const browser = await puppeteer.launch({headless:false})

    const page = await browser.newPage()

    await page.goto(url)

    const posts = await page.evaluate(() => {
        const posts =  Array.from(document.querySelectorAll('[data-test="article-title-link"]'))

        const data = posts.map(post => ({title:post.textContent,url:post.href}))

        return data
    })
    
    async function salvadados(data) {
        const convert = JSON.stringify(data,null,2)
        fs.writeFileSync('./Bitcoins.json',convert)
    }
    salvadados(posts)
    browser.close()
}

main()