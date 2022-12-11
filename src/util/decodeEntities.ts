function decodeEntities(encodedString: string) {
  const translate_re = /&(nbsp|amp|quot|lt|gt);/g;
  const translate: Record<string, string> = {
    nbsp: ' ',
    amp: '&',
    quot: '"',
    lt: '<',
    gt: '>',
  };
  return encodedString
    .replace(translate_re, function (match, entity) {
      return translate[entity];
    })
    .replace(/&#(\d+);/gi, function (match, numStr) {
      const num = parseInt(numStr, 10);
      return String.fromCharCode(num);
    });
}

export default decodeEntities;
