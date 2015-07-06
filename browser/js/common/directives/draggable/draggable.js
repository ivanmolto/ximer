app.directive('draggable', function() {
  return function(scope, element) {
    // this gives us the native JS object
    var el = element[0];
    
    el.draggable = true;
    
    el.addEventListener('dragstart', function(e) {
        e.dataTransfer.effectAllowed = 'copyMove';
        e.dataTransfer.setData('Text', this.id);
        this.classList.add('drag');

        // var obj= {
        //  start: 8,
        //  end:10
        // }

        // var j= JSON.stringify(obj);
        // e.dataTransfer.setData('yo', j);
        // console.log("TRANSFER DATA IS",JSON.parse(e.dataTransfer.getData('yo')));

        return false;
      },
      false
    );
    
    el.addEventListener('dragend', function(e) {
        this.classList.remove('drag');
        return false;
      },
      false
    );

  }
});

app.directive('droppable', function() {
  return {
    scope: {
      drop: '&' // parent
    },
    link: function(scope, element) {
      // again we need the native object
      var el = element[0];
      
      el.addEventListener('dragover', function(e) {
          e.dataTransfer.dropEffect = 'move';
          // allows us to drop
          if (e.preventDefault) e.preventDefault();
          this.classList.add('over');
          return false;
        },
        false
      );
      
      el.addEventListener('dragenter', function(e) {
          this.classList.add('over');
          return false;
        },
        false
      );
      
      el.addEventListener('dragleave', function(e) {
          this.classList.remove('over');
          return false;
        },
        false
      );
      
      el.addEventListener('drop', function(e) {
          // Stops some browsers from redirecting.
          if (e.stopPropagation) e.stopPropagation();
          
          this.classList.remove('over');
          
          var item = document.getElementById(e.dataTransfer.getData('Text'));
          this.appendChild(item);
          
          // call the drop passed drop function
          scope.$apply('drop()');
          
          return false;
        },
        false
      );
    }
  }
});
