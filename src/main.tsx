import { connect, RenderManualFieldExtensionConfigScreenCtx } from "datocms-plugin-sdk";
import "datocms-react-ui/styles.css";
import ConfigScreen from "./entrypoints/ConfigScreen";
// @ts-ignore
import SidebarMetrics2 from "./entrypoints/SidebarMetrics2";
// @ts-ignore
import PreviewConfigScreen from "./entrypoints/PreviewConfigScreen";

import { render } from "./utils/render";

import ReactDOM from "react-dom";
import React from "react";

connect({
	renderConfigScreen(ctx) {
		return render(<ConfigScreen ctx={ctx} />);
	},
  itemFormSidebarPanels() {
    return [
      {
        id: 'test-plugin',
        label: 'Ingamana Preview',
      },
    ];
  },
  renderItemFormSidebarPanel(sidebarPaneId, ctx) {
    let localSettings = false
    let field = {}
    
    Object.keys(ctx.fields).forEach(key => {
      const element = ctx.fields[key]

      if(element?.attributes?.field_type === 'json') {
        if(element?.attributes?.appearance?.field_extension === 'ingamanaPreview') {
          localSettings = JSON.parse(element?.attributes?.appearance?.parameters?.localSettings as string)
          field = element
        }
      }
    });

    // @ts-ignore
    const previewFieldId = field?.id
    const hasPreviewPlugin = !!ctx.itemType
      .relationships
      .fields
      .data
      .find((item) => { return item.id === previewFieldId})

    if(hasPreviewPlugin) {
      render(<SidebarMetrics2 ctx={ctx} localSettings={localSettings} />);
    } else {
      render(<></>)
    }
  },
  manualFieldExtensions() {
    return [
      {
        id: 'ingamanaPreview',
        name: 'Ingamana Preview',
        type: 'editor',
        fieldTypes: ['json'],
        configurable: true,
      },
    ];
  },
  renderManualFieldExtensionConfigScreen(
    fieldExtensionId: string,
    ctx: RenderManualFieldExtensionConfigScreenCtx,
  ) {
    ReactDOM.render(
      <React.StrictMode>
        <PreviewConfigScreen ctx={ctx} />
      </React.StrictMode>,
      document.getElementById('root'),
    );
  },
});
