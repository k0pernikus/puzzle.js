(function puzzle($) {
    var tile = {
        position: {
            x: null,
            y: null
        },
        neighbors: [],
        addNeighbor: function(tile) {
            this.neighbors.push(tile);
        },
        isNeighbour: function(tile) {
            return ($.inArray(tile, this.neighbors));
        }
    }

    var puzzle = {
        $viewport: null,
        image: new Image(),
        shuffle: function() {
            /* make a mess */
        },
        splitImageToTiles: function(image, x, y) {
            calcluateTileSize();
        },
        calculateTileSize: function() {
        },
        init: function(viewport) {
            this.$viewport = $(viewport);
            console.log("I was called", this.$viewport);
            //this.$viewport.hide();





        }
    }

    $puzzles = $(".puzzlejs_viewport");

    $puzzles.each(function() {
            var p = Object.create(puzzle);
            p.init(this);
    });
}(jQuery));
