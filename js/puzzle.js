(function puzzle($) {
    var $document = $(document);

    var TileProperty = {
        groups: [],
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
        isItANeighbor: function(canvas, targetTile) {
            var that = this;
            $(this.neighbors).each(function() {
                if (canvas.isEqualNode(this.canvas)) {
                    var droppedTile = this;

                    var xDiff = droppedTile.position.x - targetTile.position.x;
                    var yDiff = droppedTile.position.y - targetTile.position.y;

                    droppedTile.moveToPosition(targetTile.coordinates.left + xDiff * that.size.width, targetTile.coordinates.top + yDiff * that.size.height);

                    that.addToSameGroup(droppedTile, targetTile);
                }
            });
        },
        addToSameGroup: function(droppedTile, targetTile) {
            var that = this;
            group1 = droppedTile.groups;
            group2 = targetTile.groups;

            if (group1.length == 0 && group2.length == 0) {
                var id = 0;
                while(true) {
                    if ($.inArray(id, that.allGroups.groups) !== -1) {
                        id++;
                    } else {
                        that.allGroups.groups.push(id);
                        break;
                    }
                }
            }

            group1.push(id);
            group2.push(id);

            droppedTile.$canvas.trigger('updateClasses');
            targetTile.$canvas.trigger('updateClasses');
        },
        allGroups: {
            groups: []
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
        },
        randomize: function() {
            var x = this.getRandomNumberInRange(this.size.width, 900) - this.size.width;
            var y = this.getRandomNumberInRange(this.size.height, 500) - this.size.height;

            this.moveToPosition(x, y);
        },
        moveToPosition: function(left, top) {
            this.$canvas.animate({top: top, left: left});
        },
        moveToCorrectPosition: function() {
            this.moveToPosition(this.correctCoordinates.x, this.correctCoordinates.y);
        },
        bind: function() {
            var that = this;
            this.$canvas.bind('click', function() {
            });

            this.$canvas.on('updateClasses', function() {
                console.log('fnord');
                $(that.groups).each(function(){
                    console.log("group" + this.toString());
                    that.$canvas.addClass("group" + this.toString());
                })
            });

            this.$canvas.on('click', function() {
                $(that.neighbors).each(function() {
                    this.$canvas.css('opacity', '0.5');
                });

            });

            $document.bind('randomize', function() {
                that.preRandomize();
                that.moveToCorrectPosition();
                that.randomize();
            });

            $document.bind('solve', function() {
                that.moveToCorrectPosition();
            });

            $document.bind('getByPosition', function(event, x, y) {
                if (that.position.x == x && that.position.y == y) {
                }
            });

            $document.bind('addNeighbor', function(event, possibleNeighbor) {
                if (that === possibleNeighbor) {
                    return;
                }

                var xDiff = that.position.x - possibleNeighbor.position.x;
                var yDiff = that.position.y - possibleNeighbor.position.y;

                var isLeft = yDiff == 0 && xDiff == -1;
                var isRight = yDiff == 0 && xDiff == 1;

                var isTop = yDiff == -1 && xDiff == 0;
                var isBottom = yDiff == 1 && xDiff == 0;

                if (isLeft || isRight || isTop || isBottom) {
                    that.addNeighbor(possibleNeighbor);
                }
            });
        },
        init: function(x, y, tileSizeInPixels, $viewport) {
            this.position = Object.create(this.position);
            this.coordinates = Object.create(this.coordinates);
            this.correctCoordinates = Object.create(this.coordinates);
            this.neighbors = [];

            this.position.x = x;
            this.position.y = y;
            this.size = tileSizeInPixels;

            this.canvas = document.createElement('canvas');
            this.canvas.width = this.size.width;
            this.canvas.height = this.size.height;
            this.$canvas = $(this.canvas);
            this.$canvas.attr("data-x", x);
            this.$canvas.attr("data-y", y);

            var that = this;
            this.$canvas.draggable();

            var that = this;
            //$.extend(this.$canvas, this);
            this.$canvas.droppable({
                tolerance: "touch",
                activate: function(event, ui) {
                    var originatingOffset = ui.offset;
                },
                drop: function(event, ui) {
                    that.coordinates = that.$canvas.position();
                    var targetTile = that;
                    /**
                     * TODO: I really need to get my hands on the tile instead of only the canvas
                     */
                    var droppedCanvas = ui.draggable[0];

                    targetTile.isItANeighbor(droppedCanvas, targetTile);
                }
            });

            $viewport[0].appendChild(this.canvas);
            this.coordinates = this.$canvas.position();
            this.bind();
        }
    }

    var PuzzleProperty = {
        baseImage: null,
        size: {
            columns: 5,
            rows: 5
        },
        tiles: [],
        $viewport: null,
        image: new Image(),
        cutImageIntoTiles: function(numColsToCut, numRowsToCut, image) {
            var tileSize = this.calculateTileSize(image, numColsToCut, numRowsToCut);
            for (var y = 0; y < numRowsToCut; ++y) {
                for (var x = 0; x < numColsToCut; ++x) {
                    var tile = Object.create(TileProperty);
                    tile.position = Object.create(TileProperty.position);
                    tile.init(x, y, tileSize, this.$viewport);
                    tile.fillImage(image, x, y, tileSize);
                    this.tiles.push(tile);
                    tile = null;
                }
            }

            $(this.tiles).each(function() {
                $document.trigger('addNeighbor', this);
            });

            $(this.tiles).each(function() {
            });
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

    $document.ready(function() {
        var $puzzles = $(".puzzlejs_viewport");
        $puzzles.each(function() {
            var p = Object.create(PuzzleProperty);
            p.init(this);
        });

        $document.trigger("randomize");
    });
}(jQuery));
