(function(e){function t(t){for(var r,i,c=t[0],s=t[1],u=t[2],f=0,d=[];f<c.length;f++)i=c[f],Object.prototype.hasOwnProperty.call(a,i)&&a[i]&&d.push(a[i][0]),a[i]=0;for(r in s)Object.prototype.hasOwnProperty.call(s,r)&&(e[r]=s[r]);l&&l(t);while(d.length)d.shift()();return o.push.apply(o,u||[]),n()}function n(){for(var e,t=0;t<o.length;t++){for(var n=o[t],r=!0,c=1;c<n.length;c++){var s=n[c];0!==a[s]&&(r=!1)}r&&(o.splice(t--,1),e=i(i.s=n[0]))}return e}var r={},a={app:0},o=[];function i(t){if(r[t])return r[t].exports;var n=r[t]={i:t,l:!1,exports:{}};return e[t].call(n.exports,n,n.exports,i),n.l=!0,n.exports}i.m=e,i.c=r,i.d=function(e,t,n){i.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:n})},i.r=function(e){"undefined"!==typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},i.t=function(e,t){if(1&t&&(e=i(e)),8&t)return e;if(4&t&&"object"===typeof e&&e&&e.__esModule)return e;var n=Object.create(null);if(i.r(n),Object.defineProperty(n,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var r in e)i.d(n,r,function(t){return e[t]}.bind(null,r));return n},i.n=function(e){var t=e&&e.__esModule?function(){return e["default"]}:function(){return e};return i.d(t,"a",t),t},i.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},i.p="/RelaTime/";var c=window["webpackJsonp"]=window["webpackJsonp"]||[],s=c.push.bind(c);c.push=t,c=c.slice();for(var u=0;u<c.length;u++)t(c[u]);var l=s;o.push([0,"chunk-vendors"]),n()})({0:function(e,t,n){e.exports=n("56d7")},"034f":function(e,t,n){"use strict";var r=n("85ec"),a=n.n(r);a.a},"04d4":function(e,t,n){"use strict";var r=n("139f"),a=n.n(r);a.a},"139f":function(e,t,n){},"56d7":function(e,t,n){"use strict";n.r(t);n("e260"),n("e6cf"),n("cca6"),n("a79d");var r,a,o=n("2b0e"),i=function(){var e=this,t=e.$createElement,n=e._self._c||t;return n("div",{style:{backgroundImage:"url("+e.bgImg+")"},attrs:{id:"app"}},[n("ICALProcessor"),n("Calendar")],1)},c=[],s=function(){var e=this,t=e.$createElement,n=e._self._c||t;return n("input",{attrs:{type:"file"},on:{change:e.handleICS}})},u=[],l=(n("a4d3"),n("e01a"),n("d28b"),n("d3b7"),n("ac1f"),n("3ca3"),n("466d"),n("ddb0"),n("96cf"),n("1da1")),f=n("51e0"),d=n.n(f),h="veventdb",v=1,p={name:"idb",db:null,init:function(){var e=Object(l["a"])(regeneratorRuntime.mark((function e(){return regeneratorRuntime.wrap((function(e){while(1)switch(e.prev=e.next){case 0:if(this.db){e.next=4;break}return e.next=3,this.getDB();case 3:this.db=e.sent;case 4:case"end":return e.stop()}}),e,this)})));function t(){return e.apply(this,arguments)}return t}(),getDB:function(){var e=Object(l["a"])(regeneratorRuntime.mark((function e(){return regeneratorRuntime.wrap((function(e){while(1)switch(e.prev=e.next){case 0:return e.abrupt("return",new Promise((function(e,t){var n=window.indexedDB.open(h,v);n.onupgradeneeded=function(e){var t=e.target.result,n=t.createObjectStore("vevents",{autoIncrement:!0,keyPath:"id"});n.createIndex("course","course")},n.onerror=function(e){return t(new Error("Reject!!"))},n.onsuccess=function(t){return e(t.target.result)}})));case 1:case"end":return e.stop()}}),e)})));function t(){return e.apply(this,arguments)}return t}(),getVevents:function(){var e=Object(l["a"])(regeneratorRuntime.mark((function e(){var t=this;return regeneratorRuntime.wrap((function(e){while(1)switch(e.prev=e.next){case 0:return e.abrupt("return",new Promise((function(e,n){var r=t.db.transaction(["vevents"],"readonly"),a=r.objectStore("vevents"),o=[];a.openCursor().onsuccess=function(e){var t=e.target.result;if(t){var n=t.value;n.event=new d.a.Event(new d.a.Component(JSON.parse(n.event))),o.push(n),t.continue()}},r.oncomplete=function(t){return e(o)}})));case 1:case"end":return e.stop()}}),e)})));function t(){return e.apply(this,arguments)}return t}(),addVeventToDB:function(){var e=Object(l["a"])(regeneratorRuntime.mark((function e(t){var n=this;return regeneratorRuntime.wrap((function(e){while(1)switch(e.prev=e.next){case 0:return e.abrupt("return",new Promise((function(e,r){var a=n.db.transaction(["vevents"],"readwrite");a.oncomplete=function(t){return e()},a.objectStore("vevents").add(t)})));case 1:case"end":return e.stop()}}),e)})));function t(t){return e.apply(this,arguments)}return t}(),deleteVevent:function(){var e=Object(l["a"])(regeneratorRuntime.mark((function e(t){return regeneratorRuntime.wrap((function(e){while(1)switch(e.prev=e.next){case 0:return e.next=2,this.deleteVeventFromDB(t);case 2:return e.next=4,this.getVevents();case 4:this.vevents=e.sent;case 5:case"end":return e.stop()}}),e,this)})));function t(t){return e.apply(this,arguments)}return t}(),deleteVeventFromDB:function(){var e=Object(l["a"])(regeneratorRuntime.mark((function e(t){var n=this;return regeneratorRuntime.wrap((function(e){while(1)switch(e.prev=e.next){case 0:return e.abrupt("return",new Promise((function(e,r){var a=n.db.transaction(["vevents"],"readwrite");a.oncomplete=function(t){return e()},a.objectStore("vevents").delete(t)})));case 1:case"end":return e.stop()}}),e)})));function t(t){return e.apply(this,arguments)}return t}()},m={name:"utils",h:0,randColor:function(){return this.h=(this.h+90+Math.round(20*Math.random()))%360,{h:this.h,s:Math.round(60+40*Math.random()),l:Math.round(40+20*Math.random())}}},g={name:"ICALProcessor",methods:{handleICS:function(){var e=Object(l["a"])(regeneratorRuntime.mark((function e(t){var n,r;return regeneratorRuntime.wrap((function(e){while(1)switch(e.prev=e.next){case 0:n=t.target.files[0],r=new FileReader,r.onload=function(){var e=Object(l["a"])(regeneratorRuntime.mark((function e(t){var n,r,a,o,i,c,s,u,l,f,h,v,g,b,w;return regeneratorRuntime.wrap((function(e){while(1)switch(e.prev=e.next){case 0:n=t.target.result,r=d.a.parse(n),a=new d.a.Component(r),o=a.getAllSubcomponents("vevent"),i={},c=!0,s=!1,u=void 0,e.prev=8,l=o[Symbol.iterator]();case 10:if(c=(f=l.next()).done){e.next=23;break}return h=f.value,v=new d.a.Event(h),g=v.summary,b="",w=g.match(/^(.*?)(习题|上机)课*?$/),w&&(g=w[1],b=w[2]),g in i||(i[g]=m.randColor()),e.next=20,p.addVeventToDB({event:JSON.stringify(h),course:g,mod:b,color:i[g]});case 20:c=!0,e.next=10;break;case 23:e.next=29;break;case 25:e.prev=25,e.t0=e["catch"](8),s=!0,u=e.t0;case 29:e.prev=29,e.prev=30,c||null==l.return||l.return();case 32:if(e.prev=32,!s){e.next=35;break}throw u;case 35:return e.finish(32);case 36:return e.finish(29);case 37:case"end":return e.stop()}}),e,null,[[8,25,29,37],[30,,32,36]])})));return function(t){return e.apply(this,arguments)}}(),r.readAsText(n);case 4:case"end":return e.stop()}}),e)})));function t(t){return e.apply(this,arguments)}return t}()}},b=g,w=n("2877"),y=Object(w["a"])(b,s,u,!1,null,null,null),k=y.exports,O=function(){var e=this,t=e.$createElement,n=e._self._c||t;return n("div",{staticClass:"cal-all",on:{touchstart:e.touchStart,touchend:e.touchEnd}},[n("div",{staticClass:"cal-head"},e._l(e.formatDates,(function(t){return n("div",{key:t,staticClass:"date"},[e._v(e._s(t))])})),0),n("div",{ref:"container",staticClass:"cal-container"},[e.ready?n("div",{staticClass:"calendar",style:{height:90*e.zoom+"vh"}},[n("div",{staticClass:"time-lines"},[n("div",{style:{height:e.timeHintPadding}}),e._l(24,(function(e){return n("div",{key:e,staticClass:"line"})}))],2),n("div",{staticClass:"time-hint"},[n("div",{style:{height:"calc("+e.timeHintPadding+" - 9px)"}}),e._l(e.timeHints,(function(t){return n("p",{key:t,staticClass:"time"},[e._v(e._s(t))])}))],2),e._l(e.displayList,(function(t,r){return n("div",{key:r,staticClass:"day",class:{active:r===e.dayOfWeek}},e._l(t,(function(t,r){return n("div",{key:r,staticClass:"event",style:{height:t.height,top:t.top,"background-color":t.color}},[n("span",{staticClass:"course"},[e._v(e._s(t.course))]),t.mod?n("span",{staticClass:"mod"},[e._v(e._s(t.mod))]):e._e(),n("span",{staticClass:"location"},[e._v(e._s(t.location))])])})),0)}))],2):e._e()])])},x=[],j=(n("99af"),n("a623"),function(e){return e.touches&&(e=e.changedTouches[0]),{x:e.clientX,y:e.clientY}}),_={name:"Calendar",data:function(){return{ready:!1,addDisabled:!1,vevents:[],owlMode:26600,zoom:2,scroll:.2,firstDayOfWeek:1,date:new Date(2019,10,3),alpha:.7,touchThreshold:40}},created:function(){var e=Object(l["a"])(regeneratorRuntime.mark((function e(){var t=this;return regeneratorRuntime.wrap((function(e){while(1)switch(e.prev=e.next){case 0:return e.next=2,p.init();case 2:p.getVevents().then((function(e){t.vevents=e,t.ready=!0,o["a"].nextTick((function(){var e=t.$refs.container;e.scrollTo({top:e.scrollHeight*t.scroll})}))}));case 3:case"end":return e.stop()}}),e)})));function t(){return e.apply(this,arguments)}return t}(),methods:{touchStart:function(e){var t=j(e);r=t.x,a=t.y},touchEnd:function(e){if(r&&a){var t=j(e),n=t.x-r,o=t.y-a;Math.abs(n)>this.touchThreshold&&Math.abs(n)>Math.abs(o)&&(e.preventDefault(),this.date=n>0?new Date(+this.date-6048e5):new Date(+this.date+6048e5))}}},computed:{formatDates:function(){for(var e=[],t=0;t<7;t++){var n=new Date(this.startOfWeek.getTime()+864e5*t);e.push("".concat(n.getMonth()+1,"-").concat(n.getDate()))}return e},timeHints:function(){for(var e=Math.floor(this.owlMode/3600)+1,t=[e],n=e+1;n<24;n++)t.push(n);for(var r=0;r<e;r++)t.push(r);return t},timeHintPadding:function(){var e=this.owlMode/3600;return(Math.floor(e)+1-e)/24*100+"%"},dayOfWeek:function(){return(this.date.getDay()-this.firstDayOfWeek+7)%7},startOfWeek:function(){return new Date(this.date.getTime()-864e5*this.dayOfWeek+1e3*this.owlMode)},endOfWeek:function(){return new Date(this.startOfWeek.getTime()+6048e5)},displayList:function(){for(var e=[],t=0;t<7;t++)e.push([]);var n,r=function(e){return e.every((function(e){return e>=0}))||e.every((function(e){return e<=0}))},a=!0,o=!1,i=void 0;try{for(var c,s=this.vevents[Symbol.iterator]();!(a=(c=s.next()).done);a=!0){var u=c.value,l=u.event,f=l.duration.toSeconds(),d=l.iterator();while(n=d.next()){var h=n.toJSDate();if(h>this.endOfWeek)break;var v=new Date(h.getTime()+1e3*f);if(!r([h-this.startOfWeek,h-this.endOfWeek,v-this.startOfWeek,v-this.endOfWeek])){var p=!1,m=!0,g=!1,b=void 0;try{for(var w,y=d.exDates[Symbol.iterator]();!(m=(w=y.next()).done);m=!0){var k=w.value;if(k=k.toJSDate(),k.getFullYear()===h.getFullYear()&&k.getMonth()===h.getMonth()&&k.getDate()===h.getDate()){p=!0;break}}}catch(_){g=!0,b=_}finally{try{m||null==y.return||y.return()}finally{if(g)throw b}}if(p)continue;var O=(h.getTime()-this.startOfWeek.getTime())/1e3,x=Math.floor(O/86400),j=u.color;e[x].push({course:u.course,mod:u.mod,color:"hsla(".concat(j.h,", ").concat(j.s,"%, ").concat(j.l,"%, ").concat(this.alpha,")"),location:u.event.location,description:u.event.description,top:O%86400/864+"%",height:f/864+"%"})}}}}catch(_){o=!0,i=_}finally{try{a||null==s.return||s.return()}finally{if(o)throw i}}return e}}},C=_,D=(n("04d4"),Object(w["a"])(C,O,x,!1,null,null,null)),M=D.exports,S={name:"app",components:{ICALProcessor:k,Calendar:M},data:function(){return{bgImg:"https://allanchain.github.io/webnav/back.jpg"}},methods:{}},R=S,T=(n("034f"),Object(w["a"])(R,i,c,!1,null,null,null)),P=T.exports,W=n("9483");Object(W["a"])("".concat("/RelaTime/","service-worker.js"),{ready:function(){console.log("App is being served from cache by a service worker.\nFor more details, visit https://goo.gl/AFskqB")},registered:function(){console.log("Service worker has been registered.")},cached:function(){console.log("Content has been cached for offline use.")},updatefound:function(){console.log("New content is downloading.")},updated:function(){console.log("New content is available; please refresh.")},offline:function(){console.log("No internet connection found. App is running in offline mode.")},error:function(e){console.error("Error during service worker registration:",e)}}),o["a"].config.productionTip=!1,new o["a"]({render:function(e){return e(P)}}).$mount("#app")},"85ec":function(e,t,n){}});
//# sourceMappingURL=app.a4222cb4.js.map