import './style.css';

import { get_text_data } from './read_file';

 let test_filenames = 
[
  "backyardigans.txt",
  "charlie_brown.txt",
  "original_crawls.txt",
  "prequel_crawls.txt",
  "sequel_crawls.txt",
  "sesame_street.txt",
  "the_muppets.txt",
  "wow_wow_wubbzy.txt",
  "wubb_idol.txt",
  "wubbzys_big_movie.txt",
  "great_pumpkin_charlie_brown.txt",
  "scratch.txt",
  "disney_renaissance.txt"
];

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
  letters_typed+=1;
  if(key==lines[line_index][letter_index])
  {
    correct[line_index][letter_index]=1;
    correct_count+=1;
  }
  else
  {
    correct[line_index][letter_index]=0;
    incorrect_count+=1;
  }
  letter_index+=1;
  console.log(letter_index);
  if(letter_index>=lines[line_index].length)
  {
    letter_index=0;
    line_index+=1;
  }

  if(key==" ")
  {
    words_completed+=1;
  }
  calculate_accuracy();
  calculate_words_per_minute();
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
    if((line_text+addition).length<35)
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
function calculate_accuracy()
{
  if(correct_count+incorrect_count>0)
  {
    let accuracy_percent=Math.floor((100*correct_count)/(correct_count+incorrect_count));
    document.getElementById("accuracy")!.innerHTML=`Accuracy: ${accuracy_percent}%`;
  }
  else
  {
    document.getElementById("accuracy")!.innerHTML=`Accuracy: 100%`;
  }
  document.getElementById("letters_typed")!.innerHTML=`Letters Typed: ${letters_typed}`;
}
function calculate_words_per_minute()
{
  let words_per_minute=60*words_completed/seconds_passed;
  words_per_minute*=100;
  words_per_minute=Math.floor(words_per_minute);
  words_per_minute/=100;

  document.getElementById("words_per_minute")!.innerHTML=`Words Per Minute: ${words_per_minute}`;
}
  
/*Display the current line, two lines before and two lines after. Show if the person typed correctly for each key.*/
async function display_lines()
{
  test_text_div.innerHTML="";

  let start_line=Math.min(lines.length-3,line_index-1);
  start_line=Math.max(start_line,0);
  let end_line=Math.min(start_line+3,lines.length);

  while(end_line-start_line<max_lines_to_display&&start_line>0)
  {
    start_line-=1;
  }
  while(end_line-start_line<max_lines_to_display&&end_line<lines.length)
  {
    end_line+=1;
  }

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
        span.style.fontWeight="bold";
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
        span.style.textDecoration="line-through";
      }
    }
  }
}
/*Load all typing test file names*/
async function load_typing_tests()
{
  test_filenames.sort();

  for(let test_filename of test_filenames)
  {
    let option=document.createElement("option");
    typing_tests_datalist.appendChild(option);

    let test_filename_written=test_filename;
    test_filename_written=test_filename_written.split(".")[0];

    option.innerHTML=test_filename_written;
    option.value=test_filename_written;
  }

  if(start_right_away)
  {
    let random_test_index=Math.floor(Math.random()*test_filenames.length);
    let random_test_filename_written=test_filenames[random_test_index].split(".")[0];
    typing_tests_chooser.value=random_test_filename_written;
    load_file(`typing_tests/${random_test_filename_written}.txt`);
    toggle_test();
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
function increase_time()
{
  seconds_passed+=1;
  const minutes=Math.floor(seconds_passed/60);
  const seconds=seconds_passed-minutes*60;
  let seconds_written:string=seconds.toString();
  if(seconds_written.length==1)
  {
    seconds_written="0"+seconds_written;
  }
  document.getElementById("timer")!.innerHTML=`${minutes}:${seconds_written}`;
}
/*Access typing test input and then change the file to be loaded*/
function update_typing_test()
{
  document.getElementById("timer")!.innerHTML=`0:00`;
  seconds_passed=0;
  correct_count=0;
  incorrect_count=0;
  const test=typing_tests_chooser.value;
  console.log(`Trying to load typing_tests/${test}.txt`)
  load_file(`typing_tests/${test}.txt`);
}
/*Turn tests on and off*/
function toggle_test()
{
  if(!test_started)
  {
    seconds_passed=0;
    test_started=true;
    document.getElementById("timer")!.innerHTML=`0:00`;
    timer_function=setInterval(increase_time,1000);
    calculate_accuracy();
    document.getElementById("letters_typed")!.innerHTML=`Letters Typed: 0`;
    document.getElementById("words_per_minute")!.innerHTML=`Words Per Minute: 0`;
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

let correct_count=0;
let incorrect_count=0;
let words_completed=0;
let letters_typed=0;

let test_started=false;

let typing_tests_chooser=document.getElementById("typing_tests_chooser") as HTMLInputElement;
typing_tests_chooser.onchange=update_typing_test;

let typing_tests_datalist=document.getElementById("typing_tests") as HTMLDataListElement;

const text_size=48;
let test_text_div=document.getElementById("test_text") as HTMLDivElement;

let toggle_test_button=document.getElementById("toggle_test_button") as HTMLButtonElement;
toggle_test_button.onclick=toggle_test;

let letter_index=0;
let line_index=0;
let lines:string[];
const max_lines_to_display=3;

let start_right_away=true;

let seconds_passed=0;
let timer_function=null;
await load_typing_tests();