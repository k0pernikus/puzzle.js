(function puzzle($) {
    var tileProperty = {
        correctCoordinates: {
            x:null,
            y:null
        },
        coordinates: {
            x:null,
            y:null
        },
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
        fillImage: function(image, x, y, tileSize) {
            var ctx = this.canvas.getContext('2d');
            ctx.drawImage(image, x * this.size.width, y * this.size.height, this.size.width, this.size.height, 0, 0, this.canvas.width, this.canvas.height);
        },
        getRandomNumberInRange: function(LowerRange, UpperRange) {
            return Math.floor(Math.random() * (UpperRange - LowerRange + 1)) + LowerRange;
        },
        randomize: function() {



        },
        bind: function() {
            var that = this;
            $(this.canvas).bind('click', function() {
                console.log(that.position, that.x, that.y, $(this).position());
            });

            $(document).bind('randomize', function() {
                var x = that.getRandomNumberInRange(0, 1024);
                var y = that.getRandomNumberInRange(0, 768);

                var x = x.toString() + "px";
                var y = y.toString() + "px"

                $(that.canvas).css({"position":"absolute","left":x,"top":y});
            });
        },
        init: function(x, y, tileSizeInPixels) {
            this.position = Object.create(this.position);
            this.coordinates= Object.create(this.coordinates);
            this.correctCoordinates = Object.create(this.coordinates);

            this.position.x = x;
            this.position.y = y;
            this.size = tileSizeInPixels;

            this.canvas = document.createElement('canvas');
            this.canvas.width = this.size.width;
            this.canvas.height = this.size.height;

            document.body.appendChild(this.canvas);

            this.coordinates = $(this.canvas).position();
            this.correctCoordinates = Object.create(this.coordinates);
            this.bind();
        }
    }

    var puzzle = {
        playgroundCtx: null,
        baseImage: null,
        size: {
            columns: 5,
            rows: 5
        },
        tiles: [],
        $viewport: null,
        image: new Image(),
        shuffle: function() {
            /* make a mess :D */
        },
        cutImageUp: function(numColsToCut, numRowsToCut, image) {
            var tileSize = this.calculateTileSize(image, numColsToCut, numRowsToCut);
            for (var y = 0; y < numRowsToCut; ++y) {
                for (var x = 0; x < numColsToCut; ++x) {
                    var tile = Object.create(tileProperty);
                    tile.position = Object.create(tileProperty.position);
                    tile.init(x, y, tileSize);
                    tile.fillImage(image, x, y, tileSize);
                    this.tiles.push(tile);
                    tile = null;
                }
            }
        },
        calculateTileSize: function(image, colums, rows) {
            return {
                width: Math.ceil(image.width / colums),
                height: Math.ceil(image.height / rows)
            };
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

        $(document).trigger("randomize");
    });
}(jQuery));
