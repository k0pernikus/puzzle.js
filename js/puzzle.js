(function puzzle($, window, document) {
    var $window = $(window);
    var $document = $(document);

    var TileProperty = {
        correctCoordinatesInPixel: {
            x: null,
            y: null
        },
        coordinatesInPixel: {
            x: null,
            y: null
        },
        positionWithinGrid: {
            x: null,
            y: null
        },
        size: {
            width: null,
            height: null
        },
        neighbors: null,
        connectedNeighbors: null,
        allConnectedTiles: null,
        canvas: null,
        $canvas: null,
        traverseAllConnectedTiles: {},
        addNeighbor: function (tile) {
            this.neighbors.push(tile);
        },
        registerNeighbor: function (tile) {
            this.connectedNeighbors.push(tile);
            tile.connectedNeighbors.push(this);
        },
        handlePotentialNeighbour: function (canvas, targetTile) {
            var that = this;
            this.neighbors.forEach(function (tile) {
                if (canvas.isEqualNode(tile.canvas)) {
                    var droppedTile = tile;

                    var xDiff = droppedTile.positionWithinGrid.x - targetTile.positionWithinGrid.x;
                    var yDiff = droppedTile.positionWithinGrid.y - targetTile.positionWithinGrid.y;

                    droppedTile.animateToPosition(targetTile.coordinatesInPixel.left + xDiff * that.size.width, targetTile.coordinatesInPixel.top + yDiff * that.size.height);
                    droppedTile.registerNeighbor(targetTile);



                    var connectedTiles = [];
                    function traverse(o) {
                        if (o.hasOwnProperty("connectedNeighbors")) {
                            o["connectedNeighbors"].forEach(function (tile) {
                                if ($.inArray(tile, connectedTiles) == -1) {
                                    connectedTiles.push(tile);
                                    traverse(tile);
                                }
                            });
                        }
                    }
                    traverse(droppedTile);
                    connectedTiles.forEach(function (tile) {
                        tile.moveToCorrectPositionRelativeTo(droppedTile);
                    });
                }
            });
        },
        fillImage: function (image, x, y, tileSize) {
            var ctx = this.canvas.getContext('2d');
            ctx.drawImage(image, x * tileSize.width, y * tileSize.height, tileSize.width, tileSize.height, 0, 0, tileSize.width, tileSize.height);
        },
        getRandomNumberInRange: function (LowerRange, UpperRange) {
            return Math.floor(Math.random() * (UpperRange - LowerRange + 1)) + LowerRange;
        },
        preRandomize: function () {
            var x = this.positionWithinGrid.x * this.size.width;
            var y = this.positionWithinGrid.y * this.size.height;

            this.correctCoordinatesInPixel = {x: x, y: y};
        },
        randomize: function () {
            var x = this.getRandomNumberInRange(this.size.width, 900) - this.size.width;
            var y = this.getRandomNumberInRange(this.size.height, 500) - this.size.height;

            this.animateToPosition(x, y);
        },
        animateToPosition: function (left, top) {
            this.$canvas.animate({
                top: top,
                left: left
            });
        },
        moveToCorrectPosition: function () {
            this.animateToPosition(this.correctCoordinatesInPixel.x, this.correctCoordinatesInPixel.y);
        },
        moveToCorrectPositionRelativeTo: function (tile) {
            var position = tile.$canvas.position();
            var dX = (this.positionWithinGrid.x - tile.positionWithinGrid.x)
            var dY = (this.positionWithinGrid.y - tile.positionWithinGrid.y);
            var left = dX * this.size.width + position.left;
            var top = dY * this.size.height + position.top;

            this.animateToPosition(left, top);
        },
        bind: function () {
            var that = this;

            this.$canvas.on('click', function () {
                $(that.neighbors).each(function () {
                    this.$canvas.toggleClass('markNeighbors');

                });

            });

            $document.bind('randomize', function () {
                that.preRandomize();
                that.moveToCorrectPosition();
                that.randomize();
            });

            $document.bind('solve', function () {
                that.moveToCorrectPosition();
            });

            $document.bind('getByPosition', function (event, x, y) {
                if (that.positionWithinGrid.x == x && that.positionWithinGrid.y == y) {
                }
            });

            $document.bind('addNeighbor', function (event, possibleNeighbor) {
                if (that === possibleNeighbor) {
                    return;
                }

                var xDiff = that.positionWithinGrid.x - possibleNeighbor.positionWithinGrid.x;
                var yDiff = that.positionWithinGrid.y - possibleNeighbor.positionWithinGrid.y;

                var isLeft = yDiff == 0 && xDiff == -1;
                var isRight = yDiff == 0 && xDiff == 1;
                var isTop = yDiff == -1 && xDiff == 0;
                var isBottom = yDiff == 1 && xDiff == 0;

                if (isLeft || isRight || isTop || isBottom) {
                    that.addNeighbor(possibleNeighbor);
                }
            });
        },
        init: function (x, y, tileSizeInPixels, $viewport) {
            var Template = {
                x: null,
                y: null
            }


            this.positionWithinGrid = Object.create(Template);
            this.coordinatesInPixel = Object.create(Template);
            this.correctCoordinatesInPixel = Object.create(Template);

            this.neighbors = [];
            this.connectedNeighbors = [];

            this.positionWithinGrid.x = x;
            this.positionWithinGrid.y = y;

            this.size = tileSizeInPixels;

            this.canvas = document.createElement('canvas');
            this.canvas.width = this.size.width;
            this.canvas.height = this.size.height;
            this.$canvas = $(this.canvas);
            this.$canvas.data("data-positionWithinGrid", this.positionWithinGrid);

            var that = this;
            this.$canvas.draggable({
                revert: false,
                start: function (e, ui) {
                },
                drag: function (e, ui) {
                    var previousPosition = $(this).data('previousLocation');

                    if (!previousPosition) {
                        previousPosition = ui.originalPosition;
                    }

                    var currentPosition = $(this).position();
                    var leftOffset = currentPosition.left - previousPosition.left;
                    var topOffset = currentPosition.top - previousPosition.top;


                    that.allConnectedTiles = [];
                    function traverse(o) {
                        if (o.hasOwnProperty("connectedNeighbors")) {
                            o["connectedNeighbors"].forEach(function (tile) {
                                if ($.inArray(tile, that.allConnectedTiles) == -1) {
                                    that.allConnectedTiles.push(tile);
                                    traverse(tile);
                                }
                            });
                        }
                    }

                    traverse(that);


                    that.allConnectedTiles.forEach(function (tile) {
                        var $canvas = tile.$canvas;
                        var position = $canvas.position();
                        var left = position.left;
                        var top = position.top;
                        $canvas.css('left', left + leftOffset);
                        $canvas.css('top', top + topOffset);
                    });

                    $(this).data('previousLocation', currentPosition);
                },
                stop: function (e, ui) {
                    $(this).data('previousLocation', null);
                    that.coordinatesInPixel = null;
                    that.allConnectedTiles.forEach(function (tile) {
                        if (that !== tile) {
                            tile.moveToCorrectPositionRelativeTo(that);
                        }
                    });

                    $document.trigger('notifyConnectedTilesAmount', that.allConnectedTiles.length);
                }
            });

            var that = this;
            this.$canvas.droppable({
                tolerance: "pointer",
                drop: function (event, ui) {
                    that.coordinatesInPixel = that.$canvas.position();
                    var targetTile = that;
                    /**
                     * TODO: I really need to get my hands on the tile instead of only the canvas
                     */
                    var droppedCanvas = ui.draggable[0];

                    targetTile.handlePotentialNeighbour(droppedCanvas, targetTile);
                }
            });

            $viewport[0].appendChild(this.canvas);
            this.coordinatesInPixel = this.$canvas.position();
            this.bind();
            this.coordinatesInPixel = null;
        }
    }

    var PuzzleProperty = {
        baseImage: null,
        size: {
            columns: 4,
            rows: 4
        },
        tiles: [],
        $viewport: null,
        image: new Image(),
        cutImageIntoTiles: function (numColsToCut, numRowsToCut, image) {
            var tileSize = this.calculateTileSize(image, numColsToCut, numRowsToCut);
            for (var y = 0; y < numRowsToCut; ++y) {
                for (var x = 0; x < numColsToCut; ++x) {
                    var tile = Object.create(TileProperty);
                    tile.positionWithinGrid = Object.create(TileProperty.positionWithinGrid);
                    tile.init(x, y, tileSize, this.$viewport);
                    tile.fillImage(image, x, y, tileSize);
                    this.tiles.push(tile);
                    tile = null;
                }
            }

            this.tiles.forEach(function (tile) {
                $document.trigger('addNeighbor', tile);
            });
        },
        calculateTileSize: function (image, columns, rows) {
            return {
                width: Math.ceil(image.width / columns),
                height: Math.ceil(image.height / rows)
            };
        },
        bind: function () {
            $document.on('notifyConnectedTilesAmount', function (event, data) {
                console.log(data);
            });
        },
        init: function (viewport) {
            this.$viewport = $(viewport);
            this.baseImage = this.$viewport.find('img')[0];
            this.cutImageIntoTiles(this.size.columns, this.size.rows, this.baseImage);
            this.bind();
            $(this.baseImage).hide();
        }
    }

    $window.load(function () {
        /**
         * NOTE: window.load ensures that image is fully loaded
         */

        var $puzzles = $(".puzzlejs_viewport");
        $puzzles.each(function () {
            Object.create(PuzzleProperty).init(this);
        });

        $document.trigger("randomize");
    });
}(jQuery, window, document));
