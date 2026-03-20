import './style.css';

import { get_text_data } from './read_file';

function to_title_case(word:string):string
{
  return word.substring(0,1).toUpperCase()+word.substring(1);
}
function prepare_text(text:string):string
{
  let parts = text.split(/\s+/);
  for(let i=0;i<parts.length;i++)
  {
    if(parts[i].substring(0,1).toUpperCase()==parts[i].substring(0,1))
    parts[i]=to_title_case(parts[i]);
  }
  text=parts.join(" ");
  while(text.includes("  "))
  {
    text=text.replace("  "," ");
  }
  return text;
}
async function display_text(text:string)
{
  test_text_div.innerHTML="";
  const start_line=Math.floor(letter_index/letters_per_row);
  const start_letter=start_line*letters_per_row;

  const end_line=start_line+3;
  const end_letter=Math.min(end_line*letters_per_row,text.length)

  alert(text_size.toString());

  for(let i=start_letter;i<end_letter;i++)
  {
    const letter=text[i];
    let b=document.createElement("b");
    b.style.fontSize = text_size.toString() + "px";
    test_text_div.appendChild(b);
    b.innerHTML = letter;
  }
}
async function main()
{
  letter_index=0;
  let text:string=await get_text_data("src/typing_tests/original_crawls.txt");
  text=prepare_text(text);
  console.log(text);
  display_text(text);
}
function getTextWidth() 
{
  let span = document.createElement("span");
  document.body.appendChild(span);
  span.innerHTML="a";
  span.style.fontSize = text_size + "px";
  span.style.height = 'auto';
  span.style.width = 'auto';
  span.style.position = 'absolute';
  span.style.whiteSpace = 'no-wrap';

  const letter_width=Math.ceil(span.clientWidth);
  document.body.removeChild(span);
  return letter_width;
} 

let test_text_div=document.getElementById("test_text") as HTMLDivElement;
const text_size=48;
const letter_width=getTextWidth();
alert(letter_width);
let letters_per_row=test_text_div.clientWidth/letter_width;
let letter_index=0;
main();