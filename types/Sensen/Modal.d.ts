

declare interface SensenPluginModalState extends SensenElementState {

    status?: number;
    
}


declare interface SensenPluginModalParameter {

    host?: HTMLElement;

    locked?: boolean;
    
}




declare interface ISensenModalElement extends SensenElement<SensenPluginModalState> {

    Open(): this;

    SetContent(content : any): this;

    BuildParameters(): this;

    WhenMutationsDetected(records : MutationRecord[]): this;

    Close(): void;

}


declare interface HTMLElement{

    $modal ?: ISensenModalElement
    
} 


