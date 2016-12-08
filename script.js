// nyt book reviews queried by title/author

$(document).ready(function() {

    var url = "https://api.nytimes.com/svc/books/v3/reviews.json?api-key=35483c0931e3452c95fada150750c81f";
    var title;
    var author; 
    var output;
    var options;
    var numPages;
    var currPage = 1;
    var templateData = null;
    
    $.addTemplateFormatter("toNormalCase", function(value, options) {
        value = value.toLowerCase();
        value = value.split(" ");
        for (i=0; i < value.length; i++) {
            value[i] = value[i].charAt(0).toUpperCase() + value[i].slice(1);
        }
        value = value.join(" ");
        return value;
    })
    
    $.addTemplateFormatter("isProvided", function(value, options) {
        if (value == "") {
            return "Not provided. See full review link below";
        }
    })
    
    $.addTemplateFormatter("clickableizer", function(value, options) {
        return "<a target='_blank' href='" + value + "'><p>Full Review (Opens in new tab)</p></a>"
    })
    
    function isResults(output) {
        if (output == 0) {
            $("#results").text("No Results Found");
        } else {
            $("#results").text("");
        }
    }
    
    function inputCheck(title, author) {
        if (title == "" && author == "") {
            $("#results").text("Gimme something to work with...");
        } else {
            checkTheTimes(title, author);
        }
    }
    
    $("#go").click(function() {
        title = $("#bTitle").val();
        author = $("#bAuth").val();
        inputCheck(title, author);
    });
    
    $(document).keypress(function(e) {
    if(e.which == 13) {
        title = $("#bTitle").val();
        author = $("#bAuth").val();
        inputCheck(title, author);
    }
});
    

    function checkTheTimes(title, author) {  
    $.ajax({
      url: url,

      method: 'GET',
      data: { title: title, author: author }
    }).done(function(result) {
      output = result.results;
      isResults(result.num_results);
      countPages(result.num_results);
      templator(output);
      templateData = result.results;
      console.log(result);
    }).fail(function(err) {
      throw err;
    });
    }

    function countPages(items) {
        numPages = items / 5;
    }
    
    function templator(output, pageNo) {
        options = {
        paged: true,
        pageNo: pageNo,
        elemPerPage: 5
        }
        $("#containerID").loadTemplate("#templateID", output, options);
    }
    
    $("#prev").click(function() {
        if (currPage > 1) {
            --currPage;
            templator(templateData, currPage);
            $("#curr").text(currPage);
        }
    })
    $("#next").click(function() {
        if (currPage <= numPages) {
            ++currPage;
            templator(templateData, currPage);
            $("#curr").text(currPage);
        }
    })
    
});