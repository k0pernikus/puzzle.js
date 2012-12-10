(function puzzle($) {
    var tileAbstract = {
        position: {
            x: null,
            y: null
        },
        size: {
            width: null,
            height: null
        },
        neighbors: [],
        canvas: null,
        addNeighbor: function(tile) {
            this.neighbors.push(tile);
        },
        isNeighbour: function(tile) {
            return ($.inArray(tile, this.neighbors));
        },
        fillImage: function(image, x, y){
            var ctx = this.canvas.getContext('2d');
            ctx.drawImage(image, x * this.size.width, y * this.size.height, this.size.width, this.size.height, 0, 0, this.canvas.width, this.canvas.height);
        },
        init: function(x, y, tileSize) {
            this.position.x = x;
            this.position.y = y;
            this.size = tileSize;
            this.canvas = document.createElement('canvas');
            this.canvas.width = this.size.width;
            this.canvas.height = this.size.height;
            var that = this;
            $(this.canvas).bind('click', function(){
               console.log(that.position);
            });

            document.body.appendChild(this.canvas);
        }
    }

    var puzzle = {
        playgroundCtx: null,
        baseImage: null,
        size: {
            columns: 2,
            rows: 2
        },
        tiles: [],
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

        cutImageUp: function(numColsToCut, numRowsToCut, image) {
            var tileSize = {
                width: Math.ceil(image.width / numColsToCut),
                height: Math.ceil(image.height / numRowsToCut)
            };

            debugger;
            for(var x = 0; x < numColsToCut; ++x) {
                for(var y = 0; y < numRowsToCut; ++y) {
                    var tile = Object.create(tileAbstract);
                    tile.init(x, y, tileSize);
                    tile.fillImage(image, x, y);
                    $(tile.canvas).addClass(x.toString()).addClass(y.toString());
                    tile.position.x = x;
                    tile.position.y = y;

                    this.tiles.push(tile);
                    tile = null;
                }
            }


            console.log(this.tiles);

        },
        init: function(viewport) {
            this.$viewport = $(viewport);
            this.baseImage = this.$viewport.find('img')[0];
            this.cutImageUp(this.size.columns, this.size.rows, this.baseImage);
            $(this.baseImage).hide();
            var that = this;
        }
    }

    $(document).ready(function() {
        var $puzzles = $(".puzzlejs_viewport");
        $puzzles.each(function() {
            var p = Object.create(puzzle);
            p.init(this);
        });
    });

}(jQuery));
