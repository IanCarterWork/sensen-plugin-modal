import SensenPluginModal from "./index"


SensenPluginModal.$use();


window.addEventListener('load', () => {

    document.body.querySelectorAll<HTMLElement>('[js-open-modal]').forEach((btn)=>{

        btn.addEventListener('click', ()=>{

            const modal = SensenPluginModal.Open(`
            
            <h1>My Modal</h1>
            <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Laboriosam facere ducimus earum itaque repudiandae sint minus enim, a impedit obcaecati deleniti quae asperiores aperiam quisquam dicta necessitatibus explicabo dignissimos unde.</p>

            <button modal:action="@close" >Fermer</button>
            
            `)
            
        })
        
    })
    
})