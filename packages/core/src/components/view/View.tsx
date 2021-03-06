/*
BSD 2-Clause License

Copyright (c) 2022, Perivel LLC
All rights reserved.

Redistribution and use in source and binary forms, with or without
modification, are permitted provided that the following conditions are met:

1. Redistributions of source code must retain the above copyright notice, this
   list of conditions and the following disclaimer.

2. Redistributions in binary form must reproduce the above copyright notice,
   this list of conditions and the following disclaimer in the documentation
   and/or other materials provided with the distribution.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE
FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL
DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR
SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER
CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY,
OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
*/

import { Router, useRoutes } from "solid-app-router";
import { MetaProvider, Meta } from "solid-meta";
import { ViewComponent } from "../../types/index";
import SolidusError from "../error/SolidusError";
import DefaultLayout from "../layout/DefaultLayout";
import {
  parseThemeColorHexValue,
  routesListContainsIndexRoute,
} from "./view.fns";

/**
 * View
 *
 * A solidus component that automatically sets up routing and a default template.
 * @note Using lazy() in the routes array seems to cause the route to not be defined. Need to fix this bug.
 */

const View: ViewComponent = (props) => {
  let routes = props.routes ? props.routes : [];
  const url = props.context.server.url;
  let themeColor: string = "";
  let error: Error | null = null;

  try {
    themeColor = parseThemeColorHexValue(props.themeColor);
  } catch (e) {
    // Theme color invalid.
    error = e as Error;
  }

  // resolve the routes.
  if (!routesListContainsIndexRoute(routes)) {
    // there is no index path in the routes array. So, we need to check if
    // the index prop is set so we can use that as the index route.

    if (props.index != undefined) {
      // there is an index component. So, we can assign that as the index route.
      routes.push({
        path: "/",
        component: () => props.index,
      });
    } else {
      // there is no index route or index component. We cannot proceed.
      // So, we display the Solidus Error page, disregarding all the other
      // routes.
      error = new Error("No index route defined");
    }
  }

  // show the error component when there is an error.
  if (error) {
    routes = [
      {
        path: "/",
        component: () => <SolidusError error={error!} />,
      },
    ];
  }

  // create the routes component.
  const Content = useRoutes(routes);

  // prepare the layout.

  // When there is a SolidusError, we revert back to the DefaultLayout regardless of whether there is a
  // custom layout specified.
  const Layout = props.layout && !error ? props.layout : DefaultLayout;

  return (
    <MetaProvider tags={props.context.server.tags}>
      <Meta name="theme-color" content={themeColor}/>
      <Router url={url}>
      <Layout content={<Content />} />
      </Router>
    </MetaProvider>
  );
};

export default View;
