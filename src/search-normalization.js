export function normalizeSearchText(value){
  return String(value??"")
    .normalize("NFKD")
    .replace(/[\\u0300-\\u036f]/g,"")
    .replace(/[\\u064b-\\u065f\\u0670\\u0640]/g,"")
    .replace(/[أإآٱ]/g,"ا")
    .replace(/ى/g,"ي")
    .toLocaleLowerCase("ar");
}
