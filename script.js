//get elements
const parentEl = document.querySelector('.parent-container');
const nextEl = document.querySelector('.js-next-btn');
const prevEl = document.querySelector('.js-prev-btn');
const childEls = document.querySelectorAll('.child');
const numberOfChildEls = childEls.length;
const childEl = document.querySelectorAll('.child')[0];
const dotNotationEl = document.querySelector('.dot-notation-container');
const gap = 15;
const smallerScreen = 500;
const mediumScreen = 650;
let movedToLeft = 0;
let slides;
let inLastSlide = false;
let isClicked = false;
let intervalID;

//get the current slide value
updateSlideValue();
//add active class to DOT 
addActiveClassToDOT();

//auto play the slider
autoPlay();

window.addEventListener('resize',()=>{  
  //update slide values
  updateSlideValue();

  //check if the moved to left value is greater or equal to
  //number of slides or if inLastSlide is true
  if(inLastSlide || movedToLeft >= slides){
    //if yes then make the movedToLeft equal to the number of current slides
    movedToLeft = slides;
  }

  //add active class to DOT 
  addActiveClassToDOT();

  //update tranform values
  const transformValue = findTransformValue();
  const transformValueREM =  (movedToLeft * transformValue) / 10;
  childEls.forEach((childEl)=>{
    childEl.style.transform = `translateX(-${transformValueREM}rem)`;
  });
})

nextEl.addEventListener('click',()=>{
  //if moved to left value is less then the current number of slides
  //then move towards left otherwise move to the first slide
  movedToLeft < slides ? moveToNextSlide() : moveToFirstSlide();
  handleClickCondition();
});

prevEl.addEventListener('click',()=>{
  //if moved to left value is more then the 0
  //then move towards right otherwise move to the last slide
  movedToLeft > 0 ?  moveToPrevSlide() : moveToLastSlide();
  handleClickCondition();
})
//next functions
function moveToNextSlide(){
  movedToLeft++;
  scroll();
}
function moveToFirstSlide(){
  movedToLeft = 0;
  scroll();
}
//previous funcions
function moveToPrevSlide(){
  movedToLeft--;
  scroll();
}
function moveToLastSlide(){
  movedToLeft = slides;
  scroll();
}
//shared function
function scroll(){
  //add active class to the new scroll slide
  addActiveClassToDOT();
  //add scrolling effect accroding to movedToLeft value
  const transformValue = findTransformValue();
  const transformValueREM =  (movedToLeft * transformValue) / 10;
  childEls.forEach((childEl)=>{
      childEl.style.transform = `translateX(-${transformValueREM}rem)`;
  });

  //check if the user is in last slide
  if(movedToLeft === slides){
    inLastSlide = true
  }else{
    inLastSlide = false;
  }
}
function findTransformValue(){
  const childElWidth = childEl.getBoundingClientRect().width;
  const transformValue = childElWidth + gap;
  return transformValue;
}
//update slide value
function updateSlideValue(){
  const screenWidth = window.innerWidth;

  if(screenWidth < smallerScreen){
    slides = numberOfChildEls - 1;
  }
  else if(screenWidth > smallerScreen && screenWidth < mediumScreen){
    slides = numberOfChildEls - 2;
  }
  else if (screenWidth > mediumScreen){
    slides = numberOfChildEls - 4;
  }

  //render dots according to slide values
  renderDots();
}
function renderDots(){
  let html = '';
  for (let i = 0 ; i < slides + 1 ; i++){
    html += 
    `
      <div id="${i}" class="dot"></div>
    `;
  }
  dotNotationEl.innerHTML = html;

  //add event listener to dots 
  document.querySelectorAll('.dot')
    .forEach((dotEl)=>{
      dotEl.addEventListener('click',()=>{
        const dotID = Number(dotEl.id);
        movedToLeft = dotID;
        scroll();
        handleClickCondition();
      })
    })
}
function addActiveClassToDOT(){
  //remove active class from recent active DOT
  const activeDotElPrevious = document.querySelector('.active');
  if(activeDotElPrevious){
    activeDotElPrevious.classList.remove('active');
  }
  //add active class to DOT according to current moved to left value
  const activeDotEl = dotNotationEl.children[movedToLeft];
  activeDotEl.classList.add('active');
}


function autoPlay(){
  setInterval(()=>{
    //if the user hasnt scrolled the slider 
    //only then enable auto Play
    if(!isClicked){
      if(movedToLeft !== slides){
        movedToLeft++
        scroll();
      }else{
        movedToLeft = 0;
        scroll();
      }
    }
  },2000);
}

function handleClickCondition(){
  isClicked= true;
  changeClickedCondition();
}
function changeClickedCondition(){
  //clearn any previous timeout before you start
  //a new one
  if(intervalID){
    clearTimeout(intervalID);
  }
  intervalID = setTimeout(()=>{
    isClicked = false;
    intervalID = false;
  },1500);
}