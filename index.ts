
import { Sensen, SensenActivity, SensenComponent, SensenElement, SensenPlugin } from "sensen-jutsu";
import SensenPluginElement from "sensen-plugin-element"
import { PluginChild } from "sensen-jutsu/plugin"



interface SensenModalElement extends SensenElement<SensenPluginModalState> {

    Open(): this

    Close(): this
    
}




export const IModalAppearence : TAppearanceProps = {

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

}


const IModalElement = SensenPluginElement<SensenPluginModalState>({

    name: "modal",

    state:{

        status: 0
        
    },

    appearance:{

        ...IModalAppearence
        
    },

    construct({ element }){

        element.$emitter?.listen<SensenModalElement>('done', ({ emit })=>{

            const $overlay = PluginChild(emit, 'overlay')

            console.warn('$>', emit, $overlay )

        })

    },

    render({

        element,

        children,
        
    }){ return null }

});

export const ModalElement = IModalElement





export default function SensenPluginModal(content : any, parameter? : SensenPluginModalParameter){

    parameter = parameter || {} as SensenPluginModalParameter;

    parameter.host = parameter.host || document.body;
    
    // $host.append(`<sense-modal>${ content }</sense-modal>`)

    const modal = SensenPlugin<SensenPluginModalState>('modal')


    if( modal instanceof SensenElement ){


        modal.$assign('Open', ()=>{

            
            modal.ontransitionend  = ()=>{
                
                console.log('Open Done', modal)
                
                modal.ontransitionend = null
                
            }

            
            modal.setAttribute('ui-fx', 'transition');

            modal.setAttribute('fx-global', '');
    
            parameter?.host?.appendChild(modal)
        

            setTimeout(()=> modal.setAttribute('plugin:status', '1') , 60)

            return modal;
            
        })



        modal.$assign('Close', ()=>{

            console.log('Close', modal)

        })

        return modal as SensenModalElement;

    }
    
    return undefined

}

