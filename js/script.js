/* global Handlebars */

'use strict';

// eslint-disable-next-line no-unused-vars
const templates = {
  // eslint-disable-next-line no-undef
  articleLink: Handlebars.compile(document.querySelector('#template-article-link').innerHTML),
  tagLink: Handlebars.compile(document.querySelector('#template-tag-link').innerHTML),
  authorLink: Handlebars.compile(document.querySelector('#template-author-link').innerHTML),
  tagCloudLink: Handlebars.compile(document.querySelector('#template-tag-cloud-link').innerHTML),
  authorListSidebar: Handlebars.compile(document.querySelector('#template-list-author-link').innerHTML)
};

const titleClickHandler = function(event){
  const clickedElement = this;
  console.log('Link was clicked!');
  console.log(event);
  event.preventDefault();
  /* [DONE] remove class 'active' from all article links  */
  
  const activeLinks = document.querySelectorAll('.titles a.active');
  
  for(let activeLink of activeLinks){
    activeLink.classList.remove('active');
  }
  
  /* [IN PROGRESS] add class 'active' to the clicked link */
  clickedElement.classList.add('active');
  console.log('clickedElement:', clickedElement);
  console.log('clickedElement (with plus): ' + clickedElement);
  
  /* [DONE] remove class 'active' from all articles */
  const activeArticles  = document.querySelectorAll('.post');

  for(let activeArticle of activeArticles){
    activeArticle.classList.remove('active');
  }

  /* get 'href' attribute from the clicked link */
  const articleSelector = clickedElement.getAttribute('href');
  console.log(articleSelector);
  /* find the correct article using the selector (value of 'href' attribute) */
  const targetArticle = document.querySelector(articleSelector);

  console.log(targetArticle);
  /* add class 'active' to the correct article */
  targetArticle.classList.add('active');
  console.log(targetArticle);
};
  
  

const optArticleSelector = '.post',
  optTitleSelector = '.post-title',
  optTitleListSelector = '.titles',
  optArticleTagsSelector = '.post-tags .list',
  optArticleAuthorSelector = '.post-author',
  // eslint-disable-next-line no-unused-vars
  optTagsListSelector ='.tags.list',
  // eslint-disable-next-line no-unused-vars
  optAuthorsListSelector = '.authors',
  // eslint-disable-next-line no-unused-vars
  optCloudClassCount = '5',
  // eslint-disable-next-line no-unused-vars
  optCloudClassPrefix = 'tag-size-';

function generateTitleLinks(customSelector = ''){
  /* remove contents of titleList */
  const titleList = document.querySelector(optTitleListSelector);
  console.log(titleList);
  titleList.innerHTML = '';

  /* find all the articles and save them to variable: articles */
  const articles = document.querySelectorAll(optArticleSelector + customSelector);
  console.log(titleList);
  console.log(customSelector);

  let html = '';

  for(let article of articles){
    /* get the article id */
    const articleId = article.getAttribute('id');
    console.log(articleId);

    /* find the title element */
    /* ... */

    /* get the title from the title element */
    const articleTitle = article.querySelector(optTitleSelector).innerHTML;
    console.log(articleTitle);

    /* create HTML of the link */
    //const linkHTML = '<li><a href="#' + articleId + '"><span>' + articleTitle + '</span></a></li>';
    const linkHTMLData = {id: articleId, title: articleTitle};
    const linkHTML = templates.articleLink(linkHTMLData);
    /* insert link into html variable */
    html = html + linkHTML;
  }

  titleList.innerHTML = html;

  const links = document.querySelectorAll('.titles a');

  for(let link of links){
    link.addEventListener('click', titleClickHandler);
  }
}
generateTitleLinks();

const calculateTagsParams = function(tags) {
  const params = {max: 0, min: 999999};
  for(let tag of Object.keys(tags) ) {
    console.log(tag + ' is used ' + tags[tag] + ' times');
    if(tags[tag] > params.max) {
      params.max = tags[tag];
    }
    if(tags[tag] < params.min) {
      params.min = tags[tag];
    }
  }
  return params;
};

// eslint-disable-next-line no-unused-vars
const calculateTagClass = function(count, params) {
  const normalizedCount = count - params.min;
  const normalizedMax = params.max - params.min;
  const percentage = normalizedCount / normalizedMax;
  const classNumber = Math.floor( percentage * (optCloudClassCount - 1) + 1 );
  return optCloudClassPrefix + classNumber;
};




function generateTags(){
  /* [NEW] create a new variable allTags with an empty object */
  let allTags = {};
  /* find all articles */
  const articles = document.querySelectorAll(optArticleSelector);
  console.log(articles);
  /* START LOOP: for every article: */
  for (let article of articles){
  /* find tags wrapper */
    let tagWrapper = article.querySelector(optArticleTagsSelector);
    console.log(tagWrapper);
    /* make html variable with empty string */
    let html = '';
    /* get tags from data-tags attribute */
    let articleTags = article.getAttribute('data-tags');
    console.log(articleTags);
    /* split tags into array */
    const articleTagsArray = articleTags.split(' ');
    console.log(articleTagsArray);
    /* START LOOP: for each tag */
    for(let tag of articleTagsArray) {
      console.log(tag);
      /* generate HTML of the link */
      //const linkHTML = '<li><a href="#tag-'+ tag +'">' + tag  +'</a></li>';
      const linkHTMLData = {id: tag, title: tag};
      const linkHTML = templates.tagLink(linkHTMLData);
      console.log(linkHTML);
      /* add generated code to html variable */
      html = html + linkHTML;
      console.log(html);
      /* [NEW] check if this link is NOT already in allTags */
      // eslint-disable-next-line no-prototype-builtins
      if(!allTags.hasOwnProperty(tag)){
        /* [NEW] add generated code to allTags object */
        allTags[tag] = 1;
      } else {
        allTags[tag]++;
      }
    /* END LOOP: for each tag */
    }
    /* insert HTML of all the links into the tags wrapper */
    tagWrapper.innerHTML = html;
    console.log(tagWrapper.innerHTML);
  /* END LOOP: for every article: */
  }
  /* [NEW] find list of tags in right column */
  const tagList = document.querySelector('.tags');
  const tagsParams = calculateTagsParams(allTags);
  /* [NEW] add html from allTags to tagList */
  //tagList.innerHTML = allTags.join(' ');
  console.log(allTags);
  
  /*[NEW] create variable for all links HTML code */
  //let allTagsHTML ='';
  const allTagsData = {tags: []};
  console.log(allTagsData);
  // eslint-disable-next-line no-undef
  const tagParams = calculateTagsParams(allTags);
  console.log('tagParams:', tagParams);

  /* [NEW] START LOOP: for each tag in allTags: */
  for(let tag of Object.keys(allTags)){
    /* [NEW] generate code of a link and add it to allTagsHTML */
    const tagLinkHTML = calculateTagClass(allTags[tag], tagsParams);
    // eslint-disable-next-line no-undef
    //const tagLinkHTML = '<li>' + calculateTagClass(allTags[tag], tagsParams) + '</li>';
    console.log(tagLinkHTML);
    //allTagsHTML += '<li><a href="#tag-' + tag + '"> ' + tag +' (' + allTags[tag] + ')'  +' </a></li> ' ; 

    //allTagsHTML +=  '<li><a class="' + tagLinkHTML + '" href="#tag-' + tag +'">' + tag + '</a></li>';
    allTagsData.tags.push({
      tag:tag,
      count: allTags[tag],
      className: calculateTagClass(allTags[tag], tagsParams)
    } 
    );
    console.log(allTagsData);
  /* [NEW] END LOOP: for each tag in allTags: */
  }
  /* [NEW] add html from allTagsHTML*/

  //tagList.innerHTML = allTagsHTML;
  tagList.innerHTML=templates.tagCloudLink(allTagsData);
}
generateTags();

function tagClickHandler(event){
  /* prevent default action for this event */
  event.preventDefault();
  /* make new constant named "clickedElement" and give it the value of "this" */
  const clickedElement =this;
  console.log(clickedElement);
  /* make a new constant "href" and read the attribute "href" of the clicked element */
  const href = clickedElement.getAttribute('href');
  /* make a new constant "tag" and extract tag from the "href" constant */
  const tag = href.replace('#tag-', '');
  console.log(tag);
  /* find all tag links with class active */
  const activeTagLinks = document.querySelectorAll('a.active[href^="#tag-"]');
  console.log(activeTagLinks);
  /* START LOOP: for each active tag link */
  for(let activeTagLink of activeTagLinks) {
  /* remove class active */
    activeTagLink.classList.remove('active');
    /* END LOOP: for each active tag link */
  }
  /* find all tag links with "href" attribute equal to the "href" constant */
  const tagLinks = document.querySelectorAll('a[href="' + href + '"]');

  /* START LOOP: for each found tag link */
  for(let tagLink of tagLinks) {
  /* add class active */
    tagLink.classList.add('active');
  /* END LOOP: for each found tag link */
  }
  /* execute function "generateTitleLinks" with article selector as argument */
  generateTitleLinks('[data-tags~="' + tag + '"]');
}

function addClickListenersToTags(){
  /* find all links to tags */
  const links = document.querySelectorAll('a[href^="#tag-"]');
  /* START LOOP: for each link */
  for(let link of links) {
  /* add tagClickHandler as event listener for that link */
    link.addEventListener('click', tagClickHandler);
  /* END LOOP: for each link */
  }
}

addClickListenersToTags();


function generateAuthors(){
  /* [NEW] create a new variable allAuthors with an empty object */
  // eslint-disable-next-line no-unused-vars
  const allAuthors = {};
  console.log(allAuthors);
  /* find all articles */
  const articles = document.querySelectorAll(optArticleSelector);
  /* START LOOP: for every article: */
  for (let article of articles){
    /* find author wrapper */
    let authorWrapper = article.querySelector(optArticleAuthorSelector);
    console.log(authorWrapper);
    /* make html variable with empty string */
    let html = '';
    /* get author from data-tags attribute */
    let articleAuthor = article.getAttribute('data-author');
    console.log(articleAuthor);
    /* generate HTML of the link */
    //const linkHTML = '<li><a href="#author-' + articleAuthor + '"><span>' + articleAuthor + '</span></a></li>';

    const linkHTMLData = {id: articleAuthor, title: articleAuthor};
    const linkHTML = templates.authorLink(linkHTMLData);
    console.log(linkHTML);
    /* add generated code to html variable */
    html= html + linkHTML;
    /* insert HTML of all the links into the tags wrapper */
    authorWrapper.innerHTML = html;

    /* [NEW] check if this link is NOT already in allAuthors */
    // eslint-disable-next-line no-prototype-builtins
    if (!allAuthors.hasOwnProperty(articleAuthor)) {
      /* [NEW] add tag to allAuthors object */
      allAuthors[articleAuthor] = 1;
    } else {
      allAuthors[articleAuthor]++;
    }
    /* insert HTML of all the links into the tags wrapper */
    authorWrapper.innerHTML = html;
    /* END LOOP: for every article: */
  }
  /* [NEW] find list of authors in right column */
  const authorList = document.querySelector(optAuthorsListSelector);
  console.log(authorList);
  /* [NEW] create new variable for all author links HTML code*/
  //let allAuthorsHTML = '';
  const allAuthorsData = {authors: []};
  /*[NEW] start LOOP for each authorTag in allAuthors*/

  for (let author in allAuthors) {
    /*[NEW] generate code of a link and add it to allAuthorsHTML*/
    //allAuthorsHTML += '<li><a href="#author-' + author +'">' + author  +' (' + allAuthors[author] + ')' + '</a></li>' ;
    allAuthorsData.authors.push({
      author:author,
      count: allAuthors[author]
    }
    );
    console.log(allAuthorsData);
  }
  /* [NEW] add html from allAuthorsHTML*/
  //authorList.innerHTML = allAuthorsHTML;
  authorList.innerHTML = templates.authorListSidebar(allAuthorsData);
}
generateAuthors();

function authorClickHandler(event) {
  /* prevent default action for this event */
  event.preventDefault();
  /* make new constant named "clickedElement" and give it the value of "this" */
  const clickedElement = this;
  /* make a new constant "href" and read the attribute "href" of the clicked element */
  const href = clickedElement.getAttribute('href');
  /* make a new constant "author" and extract tag from the "href" constant */
  const author = href.replace('#author-', '');
  /* find all author links with class active */
  const activeAuthorLinks = document.querySelectorAll('a.active[href^="#author-"]');
  /* START LOOP: for each active tag link */
  for (let activeAuthorLink of activeAuthorLinks) {
    /* remove class active */
    activeAuthorLink.classList.remove('active');
  /* END LOOP: for each active tag link */
  }
  /* find all author links with "href" attribute equal to the "href" constant */
  const authorLinks = document.querySelectorAll('a[href="' + href + '"]');
  /* START LOOP: for each found tag link */
  for (let authorLink of authorLinks) {
    /* add class active */
    authorLink.classList.add('active');
  /* END LOOP: for each found tag link */
  }
  /* execute function "generateTitleLinks" with article selector as argument */
  generateTitleLinks('[data-author="' + author + '"]');
}

function addClickListenersToAuthors (){
  /* find all links to authors */
  const linkAuthors = document.querySelectorAll('a[href^="#author-"]');
  /* START LOOP: for each link */
  for(let linkAuthor of linkAuthors){
    /* add authorClickHandler as event listener for that link */
    linkAuthor.addEventListener('click', authorClickHandler);
  /* END LOOP: for each link */
  }
}

addClickListenersToAuthors();