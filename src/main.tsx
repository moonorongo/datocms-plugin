import { connect, RenderManualFieldExtensionConfigScreenCtx, RenderFieldExtensionCtx } from "datocms-plugin-sdk";
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
  // this render General Configuration
	renderConfigScreen(ctx) {
		return render(<ConfigScreen ctx={ctx} />);
	},

  // render Preview JSON field (hide all)
  renderFieldExtension(fieldExtensionId: string, ctx: RenderFieldExtensionCtx) {
    if(fieldExtensionId === 'ingamanaPreview') {
      return false;
    }
  },


  // this adds sidebar panel "Ingamana Preview"
  itemFormSidebarPanels(model, ctx) {
    const itemId = model.id
    let localSettings = false

    // @ts-ignore
    Object.keys(ctx.fields).forEach(key => {
      // @ts-ignore
      const element = ctx.fields[key]

      if(
        (element?.attributes?.field_type === 'json') && 
        (element.relationships.item_type.data.id === itemId) && 
        (element?.attributes?.appearance?.field_extension === 'ingamanaPreview')
      ) {
        localSettings = JSON.parse(element?.attributes?.appearance?.parameters?.localSettings as string)
      }
    });
    
    return localSettings? [
      {
        id: 'test-plugin',
        label: 'Ingamana Preview',
      },
    ] : []
  },

  // this render sidebar contents for "Ingamana Preview" panel
  renderItemFormSidebarPanel(sidebarPaneId, ctx) {
    let localSettings = false
    const itemId = ctx.itemType.id

    Object.keys(ctx.fields).forEach(key => {
      const element = ctx.fields[key]

      if(
        (element?.attributes?.field_type === 'json') && 
        (element.relationships.item_type.data.id === itemId) && 
        (element?.attributes?.appearance?.field_extension === 'ingamanaPreview')
      ) {
        localSettings = JSON.parse(element?.attributes?.appearance?.parameters?.localSettings as string)
      }
    });

    if(localSettings) {
      render(<SidebarMetrics2 ctx={ctx} localSettings={localSettings} />);
    } else {
      render(<></>)
    }
  },

  // this adds option "Ingamana Preview" in json field type
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

  // this render Model JSON Configuration 
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
