(function(e){function t(t){for(var n,r,o=t[0],l=t[1],c=t[2],v=0,h=[];v<o.length;v++)r=o[v],Object.prototype.hasOwnProperty.call(a,r)&&a[r]&&h.push(a[r][0]),a[r]=0;for(n in l)Object.prototype.hasOwnProperty.call(l,n)&&(e[n]=l[n]);u&&u(t);while(h.length)h.shift()();return s.push.apply(s,c||[]),i()}function i(){for(var e,t=0;t<s.length;t++){for(var i=s[t],n=!0,o=1;o<i.length;o++){var l=i[o];0!==a[l]&&(n=!1)}n&&(s.splice(t--,1),e=r(r.s=i[0]))}return e}var n={},a={app:0},s=[];function r(t){if(n[t])return n[t].exports;var i=n[t]={i:t,l:!1,exports:{}};return e[t].call(i.exports,i,i.exports,r),i.l=!0,i.exports}r.m=e,r.c=n,r.d=function(e,t,i){r.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:i})},r.r=function(e){"undefined"!==typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},r.t=function(e,t){if(1&t&&(e=r(e)),8&t)return e;if(4&t&&"object"===typeof e&&e&&e.__esModule)return e;var i=Object.create(null);if(r.r(i),Object.defineProperty(i,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var n in e)r.d(i,n,function(t){return e[t]}.bind(null,n));return i},r.n=function(e){var t=e&&e.__esModule?function(){return e["default"]}:function(){return e};return r.d(t,"a",t),t},r.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},r.p="/";var o=window["webpackJsonp"]=window["webpackJsonp"]||[],l=o.push.bind(o);o.push=t,o=o.slice();for(var c=0;c<o.length;c++)t(o[c]);var u=l;s.push([0,"chunk-vendors"]),i()})({0:function(e,t,i){e.exports=i("56d7")},"230e":function(e,t,i){"use strict";var n=i("b48e"),a=i.n(n);a.a},"56d7":function(e,t,i){"use strict";i.r(t);i("e623"),i("e379"),i("5dc8"),i("37e1");var n=i("2b0e"),a=function(){var e=this,t=e.$createElement,i=e._self._c||t;return i("div",{attrs:{id:"app"}},[i("p",{staticClass:"title"},[e._v("Vue 2048 Game")]),e._v(" "),i("Board"),e._v(" "),i("p",{staticClass:"footer"},[e._v("Made by Connie @ "+e._s(e.year))])],1)},s=[],r=function(){var e=this,t=e.$createElement,i=e._self._c||t;return i("div",{staticClass:"container"},[i("div",{staticClass:"full"},[i("Summary",{attrs:{info:{numMoves:e.numMoves,highest:e.highest,score:e.score,gameState:e.gameState,timeDiff:e.timeDiff}},on:{startGame:e.startGame}}),e._v(" "),i("div",{staticClass:"tiles"},[e._l(4,(function(t){return[e._l(4,(function(n){return[i("Tile",{key:"tile-"+t+"-"+n,attrs:{tile:e.tiles[t-1][n-1],row:t,col:n}})]}))]})),e._v(" "),i("div",{staticClass:"overlay",class:{show:"OVER"===e.gameState||"WON"===e.gameState}},[i("div",{staticClass:"text"},["OVER"===e.gameState?i("span",[e._v("Game Over! Please try again!")]):e._e(),e._v(" "),"WON"===e.gameState?i("span",[e._v("You Win!")]):e._e()])])],2)],1)])},o=[],l=(i("99af"),i("cb29"),i("4160"),i("13d5"),i("fb6a"),i("4d63"),i("ac1f"),i("25f0"),i("5319"),i("159b"),i("2909")),c=function(){var e=this,t=e.$createElement,i=e._self._c||t;return i("div",{staticClass:"actions"},[i("div",{staticClass:"stats"},[i("div",{staticClass:"score"},[e._v("Num Moves: "+e._s(e.info.numMoves))]),e._v(" "),i("div",{staticClass:"score"},[e._v("Avg merge: "+e._s(e.avg)+" secs")]),e._v(" "),i("div",{staticClass:"score"},[e._v("Highest tile: "+e._s(e.info.highest))]),e._v(" "),i("div",{staticClass:"score"},[e._v("Score: "+e._s(e.info.score))])]),e._v(" "),i("div",{staticClass:"buttons"},["RUNNING"!==e.info.gameState?i("button",{staticClass:"btn",on:{click:e.startGame}},[e._v("Start Game")]):e._e()])])},u=[],v=(i("a9e3"),i("b680"),{name:"Summary",props:{info:{numMoves:Number,highest:Number,score:Number,gameState:String,timeDiff:Number}},computed:{avg:function(){var e=this.info,t=e.timeDiff,i=e.numMoves;return(t/Math.max(1,i)/1e3).toFixed(2)}},methods:{startGame:function(){this.$emit("startGame")}}}),h=v,f=(i("230e"),i("2877")),d=Object(f["a"])(h,c,u,!1,null,"c99edbf0",null),m=d.exports,g=function(){var e=this,t=e.$createElement,i=e._self._c||t;return i("div",{class:["tile",e.tileCssClass,e.backgroundCsssClass,e.newTileCssClass]},[e.tile&&-1!==e.tile.value?i("span",{class:[e.mergeCssClass]},[e._v("\n        "+e._s(e.tile.value)+"\n    ")]):e._e()])},p=[],b={name:"Tile",props:{row:Number,col:Number,tile:Object},computed:{tileCssClass:function(){return"tile-".concat(this.row,"-").concat(this.col)},backgroundCsssClass:function(){return this.tile&&this.tile.value?"background-".concat(this.tile.value):""},newTileCssClass:function(){return this.tile&&this.tile.newlyAdded?"tile-new":""},mergeCssClass:function(){return this.tile&&this.tile.merged?"tile-merged":""}}},w=b,y=(i("f998"),Object(f["a"])(w,g,p,!1,null,"fa95552a",null)),_=y.exports;function M(e,t){t||(t=window.location.href),e=e.replace(/[\[\]]/g,"\\$&");var i=new RegExp("[?&]"+e+"(=([^&#]*)|&|#|$)"),n=i.exec(t);return n?n[2]?decodeURIComponent(n[2].replace(/\+/g," ")):"":null}var k={start:"START",won:"WON",running:"RUNNING",over:"OVER"},T=4,C=2048,O={up:38,down:40,left:37,right:39},S={name:"Board",components:{Summary:m,Tile:_},data:function(){var e=Array(T).fill(-1),t=Object(l["a"])(e).reduce((function(t,i){var n=Object(l["a"])(e).reduce((function(e,t){return e.concat({value:t,merged:!1,newlyAdded:!1})}),[]);return t.push(n),t}),[]);return{tiles:t,checkingAvailableMoves:!1,gameState:k.start,highest:0,score:0,numMoves:0,startTime:0,currentTime:0}},computed:{timeDiff:function(){return this.currentTime-this.startTime}},methods:{validIndex:function(e){return"undefined"!==typeof e&&e>=0&&e<T},assignTile:function(e,t){var i=t.row,n=t.col,a=t.value,s=t.merged,r=void 0!==s&&s,o=t.newlyAdded,l=void 0!==o&&o;if(e&&this.validIndex(i)&&this.validIndex(n)){var c=e[i].slice(0);c[n]={value:a,merged:r,newlyAdded:l},this.$set(e,i,c)}},move:function(e,t,i,n,a){for(var s=this,r=a.checkMove,o=!1,l=0;l<T*T;l++){var c=Math.abs(t-l),u=Math.floor(c/T),v=c%T;if(-1!==e[u][v].value){var h=u+i,f=v+n;while(h>=0&&h<T&&f>=0&&f<T){var d=e[h][f],m=e[u][v];if(!d||-1!==d.value){if(!0===this.canMergeWith(m,d)){if(!0===this.checkingAvailableMoves)return!0;var g=e[u][v].value,p=this.mergeWith(e,h,f,u,v);r||(this.score+=g,p>this.highest&&(this.highest=p)),o=!0;break}break}if(!0===this.checkingAvailableMoves)return!0;this.assignTile(e,{row:h,col:f,value:m.value}),this.assignTile(e,{row:u,col:v,value:-1}),u=h,v=f,h+=i,f+=n,o=!0}}}return r||setTimeout((function(){if(!0===o)if(s.numMoves+=1,s.highest<C){var t=s.addRandomTile()||{},i=t.row,n=t.col,a=t.value;s.clearMerged(),s.assignTile(e,{row:i,col:n,value:a,newlyAdded:!0}),s.movesAvailable()||(s.gameState=k.over)}else s.highest===C&&(s.gameState=k.won)}),250),o},moveUp:function(e){var t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{},i=t.checkMove,n=void 0!==i&&i;return"undefined"!==typeof e&&null!=e||(e=this.tiles),this.move(e,0,-1,0,{checkMove:n})},moveDown:function(e){var t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{},i=t.checkMove,n=void 0!==i&&i;return"undefined"!==typeof e&&null!=e||(e=this.tiles),this.move(e,T*T-1,1,0,{checkMove:n})},moveLeft:function(e){var t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{},i=t.checkMove,n=void 0!==i&&i;return"undefined"!==typeof e&&null!=e||(e=this.tiles),this.move(e,0,0,-1,{checkMove:n})},moveRight:function(e){var t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{},i=t.checkMove,n=void 0!==i&&i;return"undefined"!==typeof e&&null!=e||(e=this.tiles),this.move(e,T*T-1,0,1,{checkMove:n})},canMergeWith:function(e,t){return!t.merged&&null!==e&&!e.merged&&t.value===e.value},mergeWith:function(e,t,i,n,a){return this.canMergeWith(e[n][a],e[t][i])?(this.assignTile(e,{row:t,col:i,value:2*e[n][a].value,merged:!0}),this.assignTile(e,{row:n,col:a,value:-1}),this.currentTime=(new Date).getTime(),e[t][i].value):-1},clearMerged:function(){var e=this,t=Array(T).fill(0);Object(l["a"])(t).forEach((function(i,n){Object(l["a"])(t).forEach((function(t,i){var a=e.tiles[n][i].value;e.assignTile(e.tiles,{row:n,col:i,value:a})}))}))},movesAvailable:function(){this.checkingAvailableMoves=!0;var e=JSON.parse(JSON.stringify(this.tiles)),t=this.moveUp(e,{checkMove:!0})||this.moveDown(e,{checkMove:!0})||this.moveLeft(e,{checkMove:!0})||this.moveRight(e,{checkMove:!0});return this.checkingAvailableMoves=!1,t},addRandomTile:function(){var e,t,i=Math.floor(Math.random()*(T*T));do{i=(i+1)%(T*T),e=Math.floor(i/T),t=i%T}while(-1!==this.tiles[e][t].value);var n=Math.random()<.1?4:2;return{row:e,col:t,value:n}},startGame:function(){if(this.gameState!=k.running){this.score=0,this.highest=0,this.numMoves=0,this.startTime=(new Date).getTime(),this.currentTime=this.startTime,this.clone(),this.gameState=k.running;var e=this.addRandomTile()||{},t=e.row,i=e.col,n=e.value;this.assignTile(this.tiles,{row:t,col:i,value:n});var a=this.addRandomTile()||{},s=a.row,r=a.col,o=a.value;this.assignTile(this.tiles,{row:s,col:r,value:o})}},clone:function(){var e=this,t=Array(T).fill(-1);Object(l["a"])(t).forEach((function(i,n){Object(l["a"])(t).forEach((function(t,i){e.assignTile(e.tiles,{row:n,col:i,value:t})}))}))},setGameState:function(e){e!==k.won&&e!==k.over||(this.gameState=e)},handleKeyUp:function(e){if(this.gameState===k.running){var t=e.which||e.keyCode;switch(t){case O.up:this.moveUp();break;case O.down:this.moveDown();break;case O.left:this.moveLeft();break;case O.right:this.moveRight();break;default:break}}}},created:function(){var e=M("outcome");e!==k.won&&e!==k.over||this.setGameState(e),document.addEventListener("keyup",this.handleKeyUp)},destroyed:function(){document.removeEventListener("keyup",this.handleKeyUp)}},j=S,x=(i("c088"),Object(f["a"])(j,r,o,!1,null,"9c0142c4",null)),N=x.exports,A={name:"app",components:{Board:N},data:function(){return{year:(new Date).getFullYear()}}},R=A,E=(i("5c0b"),Object(f["a"])(R,a,s,!1,null,null,null)),G=E.exports;n["a"].config.productionTip=!1,new n["a"]({render:function(e){return e(G)}}).$mount("#app")},"5c0b":function(e,t,i){"use strict";var n=i("9c0c"),a=i.n(n);a.a},"961b":function(e,t,i){},"9c0c":function(e,t,i){},b48e:function(e,t,i){},bbf8:function(e,t,i){},c088:function(e,t,i){"use strict";var n=i("bbf8"),a=i.n(n);a.a},f998:function(e,t,i){"use strict";var n=i("961b"),a=i.n(n);a.a}});
//# sourceMappingURL=app.fa964aa2.js.map