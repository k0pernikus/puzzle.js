(function puzzle($) {
    var $document = $(document);

    var tileProperty = {
        correctCoordinates: {
            x: null,
            y: null
        },
        coordinates: {
            x: null,
            y: null
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
        $canvas: null,
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
        preRandomize: function() {
            var x = this.position.x * this.size.width;
            var y = this.position.y * this.size.height;

            this.correctCoordinates = {x: x, y: y};
            console.log(this.correctCoordinates);
        },
        randomize: function() {
            var x = this.getRandomNumberInRange(this.size.width, 900) - this.size.width;
            var y = this.getRandomNumberInRange(this.size.height, 500) - this.size.height;

            this.moveToPosition(x, y);
        },
        moveToPosition: function(left, top) {
            this.$canvas.animate({top: top.toString() + "px", left: left.toString() + "px"});
        },
        moveToCorrectPosition: function() {
            this.moveToPosition(this.correctCoordinates.x, this.correctCoordinates.y);
        },
        bind: function() {
            var that = this;
            this.$canvas.bind('click', function() {
            });

            $(document).bind('randomize', function() {
                that.preRandomize();
                that.moveToCorrectPosition();
                that.randomize();
            });

            $(document).bind('solve', function() {
                that.moveToCorrectPosition();
            });
        },
        init: function(x, y, tileSizeInPixels, $viewport) {
            this.position = Object.create(this.position);
            this.coordinates = Object.create(this.coordinates);
            this.correctCoordinates = Object.create(this.coordinates);

            this.position.x = x;
            this.position.y = y;
            this.size = tileSizeInPixels;

            this.canvas = document.createElement('canvas');
            this.canvas.width = this.size.width;
            this.canvas.height = this.size.height;
            this.$canvas = $(this.canvas);

            $viewport[0].appendChild(this.canvas);

            this.coordinates = this.$canvas.position();
            this.bind();
        }
    }

    var puzzle = {
        baseImage: null,
        size: {
            columns: 10,
            rows: 10
        },
        tiles: [],
        $viewport: null,
        image: new Image(),
        cutImageIntoTiles: function(numColsToCut, numRowsToCut, image) {
            var tileSize = this.calculateTileSize(image, numColsToCut, numRowsToCut);
            for (var y = 0; y < numRowsToCut; ++y) {
                for (var x = 0; x < numColsToCut; ++x) {
                    var tile = Object.create(tileProperty);
                    tile.position = Object.create(tileProperty.position);
                    tile.init(x, y, tileSize, this.$viewport);
                    tile.fillImage(image, x, y, tileSize);
                    this.tiles.push(tile);
                    tile = null;
                }
            }
        },
        calculateTileSize: function(image, columns, rows) {
            return {
                width: Math.ceil(image.width / columns),
                height: Math.ceil(image.height / rows)
            };
        },
        init: function(viewport) {
            this.$viewport = $(viewport);
            this.baseImage = this.$viewport.find('img')[0];
            this.cutImageIntoTiles(this.size.columns, this.size.rows, this.baseImage);
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
