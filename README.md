# Google Analytics Custom Widget

With this widget you are a able to add Google Analytics Page Tracking (for master layout and specific page) and Event Tracking inside a Mendix application.

## Contributing

For more information on contributing to this repository visit [Contributing to a GitHub repository](https://world.mendix.com/display/howto50/Contributing+to+a+GitHub+repository)!

## Overview and Basic Usage

The Google Analytics widgets set contains several widgets: Master Page Tracker, Page Tracker, Event Tracker, Event Tracker Button.

Typically you would want to start by using the Master Page Tracker by adding this widget to your master layout. By doing this, all pages in your application will be tracked by Google Analytics. You will need to provide the widget with the tracker ID that you should receive when configuring your Google Analytics account. The Master Page Tracker widget will use the combination of module name and page name in Mendix as url to be reported to Google Analytics (e.g. a page in X module which is named Y will be registered as /X/Y in Google Analytics. Note: you can also define a prefix for the url). This is an improvement compared to the previous version where you have to assign a Page Tracker for each page you would like to track.

In addition to the Master Page Tracker widget, you can add Page Tracker widget to individual pages to be able to make use of the value of the attributes of the context object. This is useful if you want to have different urls for a single page. It behaves similarly to the Format String widget where you choose attributes to format url and or title dynamically. The Page Tracker widget can be use independently or in combination with the Master Page Tracker widget. It is suggested to use it with the Master Page Tracker widget because you won't need to configure the tracker ID.
