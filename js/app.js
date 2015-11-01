/*
 *  Copyright (c) 2015, Parse, LLC. All rights reserved.
 *
 *  You are hereby granted a non-exclusive, worldwide, royalty-free license to
 *  use, copy, modify, and distribute this software in source code or binary
 *  form for use in connection with the web services and APIs provided by Parse.
 *
 *  As with any software that integrates with the Parse platform, your use of
 *  this software is subject to the Parse Terms of Service
 *  [https://www.parse.com/about/terms]. This copyright notice shall be
 *  included in all copies or substantial portions of the software.
 *
 *  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 *  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 *  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 *  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 *  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
 *  FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS
 *  IN THE SOFTWARE.
 *
 */


// var React = require('react');
// var Parse = require('parse');

// import { render } from 'react-dom'
// import { Router, Route, Link } from 'react-router'
//
// // var Router = require('react-router');
//
// console.log('Router', Router)
// console.log('Route', Route);
// console.log('Link', Link);
// console.log('render', render);
//
// var App = require('./App.react.js');
// // var Login = require('./Login.react.js');
// // var NotFound = require('./NotFound.react.js');
//
// // Insert your app's keys here:
// Parse.initialize('LID0MpbVk0JBivgVMSO6hXO5cQ3wBdlgvA8eEbES', 'VXP7SEeJtZs02Qch88qpi0olZZCoXxVRgM2dmCyO');
//
// React.render((
//     <Route path="/" component={App} />
// ), document.body)
//
//         // <Route path="login" component={Login}/>
//         // <Route path="*" component={NotFound}/>

// var Router = require('react-router'); // or var Router = ReactRouter; in browsers

// var DefaultRoute = Router.DefaultRoute;
// var Link = Router.Link;
// var Route = Router.Route;
// // var RouteHandler = Router.RouteHandler;
//
// var routes = (
//   <Route name="app" path="/" handler={App} />
// );
//   // <Route name="app" path="/" handler={App}>
//   //   <Route name="inbox" handler={Inbox}/>
//   //   <Route name="calendar" handler={Calendar}/>
//   //   <DefaultRoute handler={Dashboard}/>
//   // </Route>
//   //
// Router.run(routes, function (Handler) {
//   React.render(<Handler/>, document.body);
// });


var Router = ReactRouter;
var Route = ReactRouter.Route;
var Routes = ReactRouter.Routes;
var DefaultRoute = ReactRouter.DefaultRoute;
var Link = Router.Link;

// var React = require('react'),
//     {Route, DefaultRoute} = require('react-router'),
//     Router = require('react-router'),
var App = require('./App.react.js')
    // App = require('./components/app'),
    // YouTube = require('./components/youtube'),
    // Vimeo = require('./components/vimeo'),
    // Top = require('./components/top')
;

var routes = function() {
  // return (
  //   <Route name="app" path="/" handler={App}>
  //   </Route>
  // );
};

Router.run(routes, function(Handler) {
    React.render(<Handler/>, document.body);
    // res.send(template({
    //     initialData: JSON.stringify(data),
    //     markup: React.renderToString(React.createElement(Handler, {params: {videos: data}}))
    // }));
});


    // <Route name="app" path="/" handler={App}>
    //   <Route name="youtube" handler={YouTube} />
    //   <Route name="vimeo" handler={Vimeo} />
    //   <DefaultRoute handler={Top} />
    // </Route>
