import { connect } from "datocms-plugin-sdk";
import "datocms-react-ui/styles.css";
import ConfigScreen from "./entrypoints/ConfigScreen";
// @ts-ignore
import SidebarMetrics2 from "./entrypoints/SidebarMetrics2";
import { render } from "./utils/render";

connect({
	renderConfigScreen(ctx) {
		return render(<ConfigScreen ctx={ctx} />);
	},
  itemFormSidebarPanels() {
    return [
      {
        id: 'test-plugin',
        label: 'Test Plugin',
      },
    ];
  },
  renderItemFormSidebarPanel(sidebarPaneId, ctx) {
    render(<SidebarMetrics2 ctx={ctx} />);
  },
});
