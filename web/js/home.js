App.populator('home', function (page) {
     var p = $(page);

     /* for loader purposes */
     var loaderElem = p.find(".app-section.loader").clone();

     /* Refresh the home page */
     p.find('.app-title').on('click', function(){
          App.load('home', 'fade');
     });

     cards.ready(function(){
          /* Fetch data from zerver then use it [this kind of design must be used due to the asynchronous callbacks from zerver] */
          zAPI.getData( function(meta, posts){
               if(posts){
                    loadslideContent(posts);
               }
          });
     });

     function loadslideContent(data){

          /* Unreal SlideViewer
          - some maths to make slideViewer to function incoherent with topBar & titleBar;
          */
          var wrapper = page.querySelector('.wrapper');

          var height = (p.height() - (p.find(".titleBar").height() + p.find(".app-topbar").height()));
          wrapper.innerHTML = '';
          wrapper.style.height = height + "px";
          

          var slideViewer = new SlideViewer(wrapper, source,{startAt: 0, length: 30});

          p.find(".app-button.right").click(function(){
               k = slideViewer.page();
               
               cards.kik.send({
                    title: data[k].title,
                    text: 'So funny it\'s UNREAL',
                    pic: extract(data[k].description, 'img', 'src'),
                    linkData: JSON.stringify(data[k])
               });

          });


          slideViewer.on('flip', function(i){
               if (i >= 0){
                    p.find('.titleBar').html(data[i].title);
               }else {
                    return;
               }                 
          });


          /*
          - Force dat SlideViewer to set the title of the first post
          */
          p.find('.titleBar').html(data[0].title);

          function source(i){

               /* to bypass undefined-ness; since Slideviewer loads 3 images at a time */
               if ( i < 0 ) {
                    return;
               }

               /* For Future References if uri & publish dat is needed:
                    var postLink = data[i].link;
                    var postDate = data[i].pubDate.substr(0, data[i].pubDate.length - 14);
               */

               var postImage = extract(data[i].description,'img','src');



               /* the main slideViewer content */
               var slideContent = $('<div />').addClass("listwrapper");

               /* Enable iScroll for certain devices */
               if ( App.platform === "android" && ( App.platformVersion >= 4 && App.platformVersion < 4.1 ) ) {
                    slideContent.scrollable(true);
               } else {
                    slideContent.scrollable();
               }

                    var newPost = $('<div />')
                         .addClass('app-section')
                         .css('text-align', 'center')
                         .append(loaderElem.clone());

                    var imgSection = $('<div />')
                         .addClass('img-section')
                         .css('text-align', 'center');

                    var img = $('<img />')
                         .addClass('pageImg');

                         /* Show the loader until images are ready to be rendered & displayed */
                         img[0].onload = function() {
                              newPost.find(".loader").remove();
                              imgSection.append(img);
                              newPost.append(imgSection);
                         };

                         img.attr('src', postImage);

                         img.clickable().on('click', function(){
                              App.load('preview', data[slideViewer.page()], 'fade');
                         });



               slideContent.append(newPost);
               return slideContent[0];
          }
     }
});