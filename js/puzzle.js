(function puzzle($, window, document, u) {
    var $document = $(document);

    var TileProperty = {
        correctCoordinatesInPixel: {
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
        addNeighbor: function (tile) {
            this.neighbors.push(tile);
        },
        registerNeighbor: function (tile) {
            this.connectedNeighbors.push(tile);
            tile.connectedNeighbors.push(this);
        },
        handlePotentialNeighbour: function (canvas) {
            var that = this;
            this.neighbors.forEach(function (tile) {
                if (canvas.isEqualNode(tile.canvas)) {
                    var droppedTile = tile;

                    var xDiff = droppedTile.positionWithinGrid.x - that.positionWithinGrid.x;
                    var yDiff = droppedTile.positionWithinGrid.y - that.positionWithinGrid.y;

                    var connectedTiles = [];

                    droppedTile.animateToPosition(that.$canvas.position().left + xDiff * that.size.width, that.$canvas.position().top + yDiff * that.size.height);
                    droppedTile.registerNeighbor(that);

                    function traverse(tile) {
                        if (tile.hasOwnProperty("connectedNeighbors")) {
                            tile["connectedNeighbors"].forEach(function (tile) {
                                if ($.inArray(tile, connectedTiles) == -1) {
                                    connectedTiles.push(tile);
                                    tile.moveToCorrectPositionRelativeTo(droppedTile);
                                    traverse(tile);
                                }
                            });
                        }
                    }

                    traverse(droppedTile);
                }
            });
        },
        closeToANeighbor: function () {
            var that = this;
            this.neighbors.forEach(function (neighbor) {
                if ($.inArray(neighbor, that.allConnectedTiles) === -1) {
                    var np = neighbor.$canvas.position();
                    var tp = that.$canvas.position();

                    var delta = {
                        x: Math.abs(tp.left - np.left),
                        x2: Math.abs(tp.left - np.left + that.size.width),
                        x3: Math.abs(tp.left - np.left - that.size.width),
                        y: Math.abs(tp.top - np.top),
                        y2: Math.abs(tp.top - np.top + that.size.height),
                        y3: Math.abs(tp.top - np.top - that.size.height)
                    }

                    var tolerance = 25;

                    var isLeft = delta.x2 < tolerance && delta.y < tolerance;
                    var isRight = delta.x3 < tolerance && delta.y < tolerance;
                    var isTop = delta.x < tolerance && delta.y2 < tolerance;
                    var isBottom = delta.x < tolerance && delta.y3 < tolerance;

                    var location = that.getDirectionInGrid(neighbor);

                    if (isLeft && location.isLeft || isRight && location.isRight || isTop && location.isTop || isBottom && location.isBottom) {
                        neighbor.handlePotentialNeighbour(that.canvas);

                    }
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
        },
        randomize: function () {
            var x = this.getRandomNumberInRange(this.size.width, window.screen.availWidth) - this.size.width;
            var y = this.getRandomNumberInRange(this.size.height, window.screen.availHeight) - this.size.height;
            var that = this;
            setTimeout(function () {
                that.animateToPosition(x, y);
            }, 2000);
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

                var location = that.getDirectionInGrid(possibleNeighbor);

                if (location.isLeft || location.isRight || location.isTop || location.isBottom) {
                    that.addNeighbor(possibleNeighbor);
                }
            });
        },
        getDirectionInGrid: function (neighbor) {
            var xDiff = this.positionWithinGrid.x - neighbor.positionWithinGrid.x;
            var yDiff = this.positionWithinGrid.y - neighbor.positionWithinGrid.y;

            var isLeft = yDiff == 0 && xDiff == -1;
            var isRight = yDiff == 0 && xDiff == 1;
            var isTop = yDiff == -1 && xDiff == 0;
            var isBottom = yDiff == 1 && xDiff == 0;

            return {
                isLeft: isLeft,
                isRight: isRight,
                isTop: isTop,
                isBottom: isBottom

            }
        },
        init: function (x, y, tileSizeInPixels, $viewport) {
            var Template = {
                x: null,
                y: null
            }

            this.positionWithinGrid = Object.create(Template);
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

                    var currentPosition = that.$canvas.position();
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
                    that.allConnectedTiles.forEach(function (tile) {
                        if (that !== tile) {
                            tile.moveToCorrectPositionRelativeTo(that);
                        }
                    });

                    $document.trigger('notifyConnectedTilesAmount', that.allConnectedTiles.length);
                    that.closeToANeighbor();
                }
            });

            var that = this;
            this.$canvas.droppable({
                tolerance: "pointer",
                drop: function (event, ui) {
                    var coordinatesInPixel = that.$canvas.position();
                    var targetTile = that;
                    /**
                     * TODO: I really need to get my hands on the tile instead of only the canvas
                     */
                    var droppedCanvas = ui.draggable[0];
                    targetTile.handlePotentialNeighbour(droppedCanvas);
                }
            });

            $viewport[0].appendChild(this.canvas);
            this.coordinatesInPixel = this.$canvas.position;
            this.bind();
        }
    }

    var PuzzleProperty = {
        baseImage: null,
        size: {
            columns: 6,
            rows: 6
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

    $document.on('initPuzzle', function (e, $elem) {
        Object.create(PuzzleProperty).init($elem);
        $document.trigger('randomize');
    });

    window.puzzlejs = {
        init: function ($elem) {
            $document.trigger('initPuzzle', $elem);
        }
    };
}(jQuery, window, document));