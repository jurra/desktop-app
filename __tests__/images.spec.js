import fs from 'fs'
import { buildHtmlImage, encodesToBase64 } from '../__utils__/images'

it('downloads a image from the web and turn it into a base64', ()=> {
    // expect folder to have this image
    // then delete the image...
})

it('Stores the image in an img folder inside folder where the docs live', () => {
    
})

it('Downsizes an image to a max 1 MB', () => {
    // Lets try 1 MB for now....
})


it('converts the image into base64', async () => {
   const encoded = await encodesToBase64(__dirname + '/__fixtures__/images/file.jpg')
   expect(typeof encoded).toBe("string")
})

// This function might not be required....
it('turns a base64 image into proper html', async ()=>{
    const regex = /^data:image\/png;base64,/ // Check with regex that the patter matches
    const encoded = await encodesToBase64(__dirname + '/__fixtures__/images/file.jpg')
    const mock = `<img src="data:image/jpeg;base64,${encoded}">`
    const result = buildHtmlImage(encoded)
    expect(result.match(regex)).toEqual(mock.match(regex))
})


