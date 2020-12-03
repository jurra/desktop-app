import jimp from 'jimp';

class Replace {
  constructor(html, regex, regex2) {
    this.base64String = '';
    this.html = html;
    this.regex = regex;
    this.regex2 = regex2;
    this.image = '';

    // const regex2 = /(?<alt>!\[[^\]]*\])\((?<filename>.*?)(?=\"|\))\)/i;
    return this.html.replace(regex, (v) => {
      const imgObject = v.match(regex2);

      if (
        !imgObject ||
        !imgObject.groups ||
        imgObject.length < 1 ||
        typeof imgObject === 'undefined'
      ) {
        return v;
      }

      const base64string = imgObject.groups.base64string;

      if (base64string.match(/^http/)) {
        return v;
      }

      const alt = imgObject.groups?.alt;
      const maxWidth = 100;

      return jimp
        .read(Buffer.from(base64string, 'base64'))
        .then((res) => {
          let _width = res.getWidth();

          if (_width > maxWidth) {
            _width = maxWidth;
          }

          res.resize(_width, jimp.AUTO).quality(0);

          // let response = `data:image/jpg;base64,${res.bitmap.data.toString(
          // 	'base64'
          // )}`;
          return res.getBase64(res.getMIME(), (err, val) => {
            if (err) throw new Error(err);

            this.base64String = `data:image/jpg;base64,${val}`;
            this.image = `<img src="data:image/jpeg;base64,${this.base64String}" alt="${alt}" />`;

            console.log({ val, response: this.image });
            return this.image;
          });
        })
        .catch((err) => {
          const msg = 'sharp error: ' + err;
          // console.log(msg);
          this.opsDisplay = msg;
        });
    });
  }
}

export default Replace;
