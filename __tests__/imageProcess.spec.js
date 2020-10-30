import fs from 'fs'
import { buildHtmlImage } from '../__utils__/images'

it('downloads a image from the web and turn it into a base64', ()=> {
    
})

it('converts the image into base64', () => {
   // input is a file (jpg, ideally an already downsized jpg)  
   // output is base64
   // get the first 11 strings???
})

it.only('turns a base64 image into proper html', ()=>{
   // get encoded base 64 image
    const encodedImage =  fs.readFileSync(__dirname + '/__fixtures__/images/image.txt', 'utf8')
    let mock = `<img src=${encodedImage}>`
    let result = buildHtmlImage(encodedImage)
    expect(mock).toEqual(result)
})

