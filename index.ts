
import { SensenAppearance } from "sensen-jutsu/appearance";
import { SensenPluginExtended } from "sensen-jutsu/plugin"







export type ModalAbilitiesStatement<T> = {

    slots ?: ModalAbilitiesSlots<T>
    
}



export type ModalAbilitiesSlots<T> = {

    [P : string] : (dependencies : ComponentRenderDependencies<T>) => string | Node;
    
}



export type SensenPluginModalProps = SensenPluginExtendedProps & {

    iD?: string;

    title?: string;

    locked?: boolean;

    host?: HTMLElement;

    color?: string;
    
}

export type SensenPluginModalHostOverflow = {

    x: string;

    y: string;
    
}


/**
 * Sensen Plugin Modal
 * use `$use()` method to initialize the modal element.
 * 
 * use `@sensen-modal` as value of `plug:bind` on HTML Element to bind modal methods on `$plugin` property on current HTML element.
 */
export default class SensenPluginModal extends SensenPluginExtended<SensenPluginModalProps>{


    static $name = 'plugin-modal';

    $identity: string = '@sensen-modal';
    

    $underlay : HTMLElement;

    $overlay : HTMLElement;

    $hostOverflow : SensenPluginModalHostOverflow = {} as SensenPluginModalHostOverflow
    
    $hostComputed : CSSStyleDeclaration = {} as CSSStyleDeclaration

    $apparence = new SensenAppearance()


    constructor(props?: SensenPluginModalProps){

        super(props);

        
        this.$apparence.selectors(SensenModalAppearence).mount().bind(this)

        this.$props = props || {} as SensenPluginModalProps

        this.$props.host = this.$props?.host || document.body



        this.$underlay = document.createElement('div');

        this.$overlay = document.createElement('div');



        this.$underlay.setAttribute(`plugin-child`, '@underlay')

        this.$overlay.setAttribute(`plugin-child`, '@overlay')


        this.$setColor(props?.color)
        

        this.appendChild(this.$underlay)

        this.appendChild(this.$overlay)
        
    }




    $setColor(color ?: string){

        if(color){

            this.style.backgroundColor = color;
            
        }
        
    }
    
    


    $render(){

        return this.$initProps().$initEmitters();

    }



    $captureHostState(){

        this.$hostComputed = getComputedStyle(this.$props?.host || document.body)

        this.$hostOverflow = {

            x: this.$hostComputed.overflowX,

            y: this.$hostComputed.overflowY,
            
        }

        return this;

    }

    

    $disableHostScrolling(){

        if(this.$props?.host){

            this.$props.host.style.overflowX = 'none';

            this.$props.host.style.overflowY = 'none';

        }

        return this;
        
    }



    $enableHostScrolling(){

        if(this.$props?.host){

            this.$props.host.style.overflowX = `${ this.$hostOverflow.x }`;

            this.$props.host.style.overflowY = `${ this.$hostOverflow.y }`;

        }

        return this;
        
    }
    
    


    $initProps(){

        // const rex = /^plugin\:/

        // if(this){

        //     Object.values(this.attributes).map(attribute=>{

        //         if(attribute.name.match(rex)){
    
        //             const name = attribute.name.replace(rex, '')
                    
        //             this?.setAttribute(name, attribute.value)
    
        //         }
                
        //     })

        // }
        
        return this;

    }




    $initEmitters(){


        this.$emitter.listen<MutationRecord[]>('contentChange', ({emit:records, type})=>{

            this.$bewitchment();
            
        })

        if(this.$underlay){

            if(!this.$props?.locked){

                this.$underlay.onclick = ()=>{

                    this.$close();
                    
                }

            }
            
        }

        return this;
        
    }
    


    SetContent(content?: string | Node){

        if(typeof content == 'string'){

            this.$overlay.innerHTML = content || ''

        }

        else{

            if(content === null){

                this.$overlay.innerHTML = '';
                
            }

            if(content instanceof Node){

                this.$overlay.appendChild(content)
                
            }

            else{

                throw (`Modal content is not supported`)
                
            }
            
            
        }
        

        return this;
        
    }
    


    $open(content?: string | Node){

        this.$captureHostState().$disableHostScrolling()

        this.setAttribute('plugin:id', `modal-${ this.$props?.iD || 'undefined' }`)


        this.$emitter.listen<SensenPluginModal>('open', (e)=>{

            // console.warn('Build Content Now', e)

            this.SetContent(content)
            
        })
        

        
        this.ontransitionend  = ()=>{
            
            this.$emitter.dispatch('open', [this])
            
            this.ontransitionend = null
            
        }
        
        this.setAttribute('ui-fx', 'transition');

        this.setAttribute('fx-global', '');

        this.$props?.host?.appendChild(this);
        
        
        setTimeout(()=>{

            this.setAttribute('plugin:status', '1');

        }, 60)
        
        
        return this;
        
    }
    


    $close(){

                
        this.ontransitionend  = ()=>{
            
            this.parentNode?.removeChild(this)
            
            this.$emitter.dispatch('close', [this])

            this.$enableHostScrolling();
            
            this.ontransitionend = null

        }

        this.setAttribute('plugin:status', '0');


        return this;
        
    }
    


    static Open(content: string | Node, props?: SensenPluginModalProps){

        return (new SensenPluginModal(props)).$open(content);
        
    }
    


    static Close(name: string, host?: HTMLElement){

        const get  = (host || document).querySelector(`[plugin\\:id="modal-${ name }"]`) as SensenPluginModal

        if(get){ get.$close(); }
        
        return this;
        
    }
    


    static $use(){

        if(!customElements.get(this.$name)){

            customElements.define(this.$name, this)
            
        }

        return this;
        
    }
    
    
    
}



/**
 * Sensen Plugin Modal Methods Abilities
 */
export function SensenModalAbilities<T extends SensenElementState>(

    statement ?: ModalAbilitiesStatement<T>
    
){


    return {

        modal($){

            if( statement && statement.slots && $ &&  $.record && $.record.node instanceof HTMLElement ){

                const slot = ($.record.node.getAttribute('modal-slot') || undefined) as keyof ModalAbilitiesSlots<T>;
                
                if(slot){

                    const entry = statement.slots[ slot ];

                    if(typeof entry == 'function'){

                        const host = $.record.node.getAttribute(`modal-host`)

                        const title = $.record.node.getAttribute(`modal-title`) || '';

                        const locked = $.record.node.getAttribute(`modal-locked`)

                        const color = $.record.node.getAttribute(`modal-color`) || '';

                        const content = entry.apply($.element.$methods, [$]);

                        return SensenPluginModal.Open(content,{

                            iD: slot as string,

                            host: document.querySelector(host as string) as HTMLElement,

                            title,

                            locked: locked ? true : false,

                            color,
                                                        
                        })
                        
                    }

                }
                

            }

        }
        
    } as SensenElementMethods<T> | undefined

    
}







/**
 * Sensen Modal Apprearance
 */

export const SensenModalAppearence : TAppearanceProps = {

    $self:{

        position: 'fixed',

        zIndex: '910',

        backgroundColor: 'var(--color-layer-rgb-big)',
        

    },



    '&, &[plugin\\:status="0"]': {

        transform: 'translateY(100%)',

        opacity: '0.0',
    },



    '&[plugin\\:status="1"]': {

        transform: 'translateY(0%)',

        opacity: '1',
    },


    '[plugin-child="@overlay"]': {
        
        opacity: '0.0',

        transform: 'translateY(10%)',

    },



    '&[plugin\\:status="1"] [plugin-child="@overlay"]' : {
        
        opacity: '1',

        transitionDelay: 'calc( var(--fx-duration) - ( var(--fx-duration) / 90 ) )',
        
        transform: 'translateY(0%)',

    },



    '&, [plugin-child="@underlay"]' : {

        display: 'flex',
    
        justifyContent: 'center',
    
        alignItems: 'center',
    
        flexDirection: 'column',

        top: '0', 
        
        left: '0',

        width: '100vw',
    
        height: '100vh',
    
    },


    '[plugin-child="@underlay"]' : {

        position: 'absolute'

    }


}



