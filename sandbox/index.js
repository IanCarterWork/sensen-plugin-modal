import { SensenElement, SensenPlugin } from "sensen-jutsu";
import SensenPluginElement from "sensen-plugin-element";
import { GetPluginChild, PluginChild } from "sensen-jutsu/plugin";
export const ModalAppearence = {
    $self: {
        position: 'fixed',
        zIndex: '910',
        backgroundColor: 'var(--color-layer-rgb-big)',
    },
    '&, &[plugin\\:status="0"]': {
        transform: 'translateY(100%)',
        opacity: '0.0',
    },
    '&, &[plugin\\:status="1"]': {
        transform: 'translateY(0%)',
        opacity: '1',
    },
    '[plugin-child="@overlay"]': {
        opacity: '0.0',
        transform: 'translateY(10%)',
    },
    '&[plugin\\:status="1"] [plugin-child="@overlay"]': {
        opacity: '1',
        transitionDelay: 'calc( var(--fx-duration) - ( var(--fx-duration) / 90 ) )',
        transform: 'translateY(0%)',
    },
    '&, [plugin-child="@underlay"]': {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column',
        top: '0',
        left: '0',
        width: '100vw',
        height: '100vh',
    },
    '[plugin-child="@underlay"]': {
        position: 'absolute'
    }
};
const IModalElement = SensenPluginElement({
    name: "modal",
    state: {
        status: 0
    },
    appearance: {
        ...ModalAppearence
    },
    construct({ element }) {
        element.$emitter?.listen('done', ({ emit }) => {
            PluginChild(emit, 'underlay');
            const $overlay = PluginChild(emit, 'overlay');
            const observer = new MutationObserver((records) => {
                if (records) {
                    emit.WhenMutationsDetected(records);
                }
            });
            observer.observe($overlay, {
                subtree: true,
                childList: true,
            });
            emit.BuildParameters();
        });
    },
    render({ element, children, }) { return null; }
});
export const ModalElement = IModalElement;
export default function SensenPluginModal(content, parameter) {
    parameter = parameter || {};
    parameter.host = parameter.host || document.body;
    parameter.locked = typeof parameter.locked == 'boolean' ? parameter.locked : true;
    const modal = SensenPlugin('modal');
    if (modal instanceof SensenElement) {
        modal.$assign('Open', () => {
            const $this = modal;
            $this.ontransitionend = () => {
                $this.ontransitionend = null;
            };
            parameter?.host?.appendChild($this);
            $this.setAttribute('ui-fx', 'transition');
            $this.setAttribute('fx-global', '');
            $this.SetContent(content);
            setTimeout(() => $this.setAttribute('plugin:status', '1'), 60);
            return $this;
        });
        modal.$assign('WhenMutationsDetected', (records) => {
            const $this = modal;
            const $closer = GetPluginChild($this, 'modalClose');
            records.map(record => {
                if (record.target instanceof HTMLElement) {
                    const $closers = record.target.querySelectorAll(`[modal\\:action="@close"]`);
                    $closers.forEach(closer => closer.addEventListener('click', () => $this.Close()));
                }
            });
            document.querySelectorAll(`*`).forEach(child => {
                if (child instanceof HTMLElement) {
                    child.$modal = $this;
                }
            });
            return $this;
        });
        modal.$assign('BuildParameters', () => {
            const $this = modal;
            const $underlay = PluginChild($this, 'underlay');
            if (parameter?.locked === true) {
                $underlay.addEventListener('click', () => { $this.Close(); });
            }
            return $this;
        });
        modal.$assign('SetContent', (content) => {
            const $this = modal;
            const $overlay = PluginChild($this, 'overlay');
            if (typeof content == 'string') {
                $overlay.innerHTML = content;
            }
            else {
                if (typeof content == 'object') {
                    $overlay.appendChild(content);
                }
            }
            return $this;
        });
        modal.$assign('Close', () => {
            const $this = modal;
            $this.ontransitionend = () => {
                $this.parentNode?.removeChild($this);
                $this.ontransitionend = null;
            };
            $this.setAttribute('plugin:status', '0');
        });
        return modal;
    }
    return undefined;
}
