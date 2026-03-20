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
/*Check what key the player typed and see if it matches the current key*/
function check_key(key:string)
{
  if(key==lines[line_index][letter_index])
  {
    correct[line_index][letter_index]=1;
  }
  else
  {
    correct[line_index][letter_index]=0;
  }
  letter_index+=1;
  console.log(letter_index);
  if(letter_index>=lines[line_index].length)
  {
    letter_index=0;
    line_index+=1;
  }
  display_lines();
}
/*Convert raw text into lines of 38 characters. Words are kept together*/
function text_to_lines(text:string)
{
  let words:string[]=text.split(" ");
  let lines:string[]=[];

  let line_text="";
  for(let i=0;i<words.length;i++)
  {
    const addition=words[i]+" ";
    if((line_text+addition).length<38)
    {
      line_text+=addition;
    }
    else
    {
      lines.push(line_text);
      line_text=words[i]+" ";
    }
  }

  if(line_text.length>0)
  {
    lines.push(line_text);
  }
  return lines;
}
/*Display the current line, two lines before and two lines after. Show if the person typed correctly for each key.*/
async function display_lines()
{
  test_text_div.innerHTML="";

  let start_line=Math.min(lines.length-3,line_index-1);
  start_line=Math.max(start_line,0);
  const end_line=Math.min(start_line+3,lines.length);
  for(let i=start_line;i<end_line;i++)
  {
    let line_div=document.createElement("div");
    test_text_div.appendChild(line_div);
    for(let j=0;j<lines[i].length;j++)
    {
      const letter=lines[i][j];
      let span=document.createElement("span");
      line_div.appendChild(span);
      span.style.fontSize = text_size.toString() + "px";

      if(letter==" "&&letter_index==j&&line_index==i)
      {
        span.innerHTML="_";
      }
      else
      {
        span.innerHTML = letter;
      }

      if(letter_index==j&&line_index==i)
      {
        span.style.textDecoration="underline";
        span.style.color="blue";
      }
      else if(correct[i][j]==1)
      {
        span.style.color="green";
      }
      else if(correct[i][j]==0)
      {
        span.style.color="red";
      }
    }
  }
}
/*Load all typing test file names*/
async function load_typing_tests()
{
  
  const test_filenames = 
  [
  "charlie_brown.txt",
  "original_crawls.txt",
  "prequel_crawls.txt",
  "sequel_crawls.txt",
  "sesame_street.txt",
  "the_muppets.txt",
  "wow_wow_wubbzy.txt",
  "wubb_idol.txt",
  "wubbzys_big_movie.txt",
  ];

  for(let test_filename of test_filenames)
  {
    let option=document.createElement("option");
    typing_tests_datalist.appendChild(option);

    let test_filename_written=test_filename;
    test_filename_written=test_filename_written.split(".")[0];

    option.innerHTML=test_filename_written;
    option.value=test_filename_written;
  }
}
/*Load specific typing test file*/
async function load_file(filename:string)
{
  letter_index=0;
  line_index=0;
  text=await get_text_data(filename);
  text=prepare_text(text);
  lines=text_to_lines(text);
  correct=[];
  for(let i=0;i<lines.length;i++)
  {
    correct.push([]);
    for(let j=0;j<lines[i].length;j++)
    {
      correct[i].push(-1);
    }
  }
  console.log(lines);
  display_lines();
}
/*Access typing test input and then change the file to be loaded*/
function update_typing_test()
{
  const test=typing_tests_input.value;
  console.log(`Trying to load typing_tests/${test}.txt`)
  load_file(`typing_tests/${test}.txt`);
}
/*Turn tests on and off*/
function toggle_test()
{
  if(!test_started)
  {
    test_started=true;
    toggle_test_button.innerHTML="Stop Test";
    update_typing_test();
  }
  else
  {
    test_started=false;
    toggle_test_button.innerHTML="Start Test";
  }
}
document.body.addEventListener("keydown", function (e) 
{
  if(test_started)
  {
    e.preventDefault();
    let key=e.key;
    if(key!="Shift")
    {
      check_key(key);
    }
  }
});

let text:string="";
let correct:number[][];

let test_started=false;

let typing_tests_input=document.getElementById("typing_tests_input") as HTMLInputElement;
typing_tests_input.onchange=update_typing_test;

let typing_tests_datalist=document.getElementById("typing_tests") as HTMLDataListElement;

const text_size=48;
let test_text_div=document.getElementById("test_text") as HTMLDivElement;


let toggle_test_button=document.getElementById("toggle_test_button") as HTMLButtonElement;
toggle_test_button.onclick=toggle_test;

let letter_index=0;
let line_index=0;
let lines:string[];
await load_typing_tests();