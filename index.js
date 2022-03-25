import { SensenElement, SensenPlugin } from "sensen-jutsu";
import SensenPluginElement from "sensen-plugin-element";
import { PluginChild } from "sensen-jutsu/plugin";
export const IModalAppearence = {
// $self:{
//     position:'fixed',
//     top:'0',
//     left:'0',
//     minWidth: '100%',
//     minHeight: '100%',
//     maxWidth: '100vw',
//     maxHeight: '100vh',
//     backgroundColor: "var(--color-layer-rgb-large)"
// }
};
const IModalElement = SensenPluginElement({
    name: "modal",
    state: {
        status: 0
    },
    appearance: {
        ...IModalAppearence
    },
    construct({ element }) {
        element.$emitter?.listen('done', ({ emit }) => {
            const $overlay = PluginChild(emit, 'overlay');
            console.warn('$>', emit, $overlay);
        });
    },
    render({ element, children, }) { return null; }
});
export const ModalElement = IModalElement;
export default function SensenPluginModal(content, parameter) {
    parameter = parameter || {};
    parameter.host = parameter.host || document.body;
    // $host.append(`<sense-modal>${ content }</sense-modal>`)
    const modal = SensenPlugin('modal');
    if (modal instanceof SensenElement) {
        modal.$assign('Open', () => {
            modal.ontransitionend = () => {
                console.log('Open Done', modal);
                modal.ontransitionend = null;
            };
            modal.setAttribute('ui-fx', 'transition');
            modal.setAttribute('fx-global', '');
            parameter?.host?.appendChild(modal);
            setTimeout(() => modal.setAttribute('plugin:status', '1'), 60);
            return modal;
        });
        modal.$assign('Close', () => {
            console.log('Close', modal);
        });
        return modal;
    }
    return undefined;
}
