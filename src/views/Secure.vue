<template>
    
    <div id="secure" @click="detectAndCloseDropdown($event)">
        <header>
            <div class="header-inner inner-container">
                <router-link to="/secure" class="logo"><img src="../assets/logo.png"></router-link>

                <div class="menu">
                    <label for="menu"><span>{{ local_user }}</span></label>
                    <input type="checkbox" id="menu" @click="e => e.target.parentElement.classList.toggle('menu-active')">
                    <div id="nav">
                        <router-link to="/login" replace><i class="fas fa-sign-out-alt"></i> Log out</router-link>
                    </div>
                </div>
            </div>
        </header>
        <section class="page-description inner-container">
            <h2>Manage your to do list</h2>
            <p>Click on checkbox or drag and drop to done.</p>
        </section>

        <div class="card-scene inner-container">
            
            <Container v-for="column in scene.children" :key="column.id">

                <div :class="column.props.className">
                <div class="card-column-header">
                    <span>{{ column.name }}</span>
                    <div v-if="column.id == 'column0'">
                        <button v-if="!editing" class="todo-action" @click="newTodo($event, column.id)"></button>
                    </div>
                    <div v-if="column.id == 'column1'">
                        <button v-if="!editing" class="done-action" @click="clearTodo($event, column.id)" :disabled="column.children.length < 1"><i class="fas fa-trash-alt"></i></button>
                    </div>
                </div>
                <Container
                    group-name="col"
                    @drop="(e) => onCardDrop(column.id, e)"
                    @drag-start="(e) => log('drag start', e)"
                    @drag-end="(e) => log('drag end', e)"
                    :get-child-payload="getCardPayload(column.id)"
                    drag-handle-selector=".card-drag-handle"
                    drag-class="card-ghost"
                    drop-class="card-ghost-drop"
                    behaviour="drop-zone"
                    non-drag-area-selector="textarea"
                    :drag-begin-delay="300"
                    :animation-duration="640"
                    :auto-scroll-enabled="true"
                    :drop-placeholder="upperDropPlaceholderOptions"
                >
                    <Draggable v-for="card in column.children" :key="card.id">
                    <div :class="card.props.className" :style="card.props.style">
                        <div class="card-item-header">

                            <div><span v-if="!card.data.editing && !editing" class="card-drag-handle" title="Click and hold to move.">&#x2630;</span></div>
                            
                            <div class="todo-checkbox" v-if="!card.data.editing && !editing">
                                <span class="checkbox" v-if="column.id == 'column0'" @click="markDone($event, column.id, card.id)"><i class="far fa-square"></i></span>
                                <span class="checkbox" v-if="column.id == 'column1'" @click="unMarkDone($event, column.id, card.id)"><i class="far fa-check-square"></i></span>
                            </div>

                            <div class="todo-action-area">
                                <button v-if="!card.data.editing && !editing" class="todo-action" @click="showTodoItemDrop" >
                                    <i class="todo-action-child">&middot;</i>
                                    <i class="todo-action-child">&middot;</i>
                                    <i class="todo-action-child">&middot;</i>
                                </button>
                                <ul class="todo-dropdown" :class="card.id">
                                    <li class="item-image-add" v-if="!card.data.image && card.data.content && column.id == 'column0'"><input type="file" :class="card.id" :ref="card.id" style="display: none;" @change="uploadImage" :data-column="column.id" :data-card="card.id"><a href="#" @click="imageTodo($event, column.id, card.id)">Add image</a></li>
                                    <li class="item-image-change" v-if="card.data.image && column.id == 'column0'"><a href="#"@click="removeImage($event, column.id, card.id)">Remove image</a></li>
                                    <li class="item-edit" v-if="card.data.content && column.id == 'column0'" @click="editTodo($event, column.id, card.id, card.data.content)"><a href="#">Edit content</a></li>
                                    <li class="item-delete"><a href="#" @click="removeTodo($event, column.id, card.id)">Delete</a></li>
                                </ul>
                            </div>
                        </div>
                        <div class="todo-image">
                            <img v-if="card.data.image" :src="card.data.image">
                        </div>
                        <div class="todo-content" v-if="card.data.content && !card.data.editing">
                            <p>{{ card.data.content }}</p>
                        </div>
                        <div v-if="card.data.editing" class="todo-content-edit">
                            <textarea v-on:keyup.enter="saveTodo($event, column.id, card.id)" placeholder="Add content here" :value="card.data.content"></textarea>
                            <button type="button" @click.prevent="saveTodo($event, column.id, card.id)">Save content</button>
                        </div>
                    </div>
                    </Draggable>
                    <div v-if="!column.children.length">
                        <em class="empty-msg">{{ column.name }} list is empty.</em>
                    </div>
                    
                </Container>
                </div>
            </Container>
        </div>
    </div>
</template>

<script>
    import { Container, Draggable } from 'vue-smooth-dnd'
    import { applyDrag, generateList, generateItems } from '../utils/helpers'
    

    const columnNames = ['To-do list', 'Done']

    const scene = {
        type: 'container',
        props: {
            orientation: 'horizontal'
        },
        children: generateItems(2, i => ({
            id: `column${i}`,
            type: 'container',
            name: columnNames[i],
            props: {
                orientation: 'vertical',
                className: 'card-container'
            },
            children : generateList(i)
        }))
    }

    
    export default {
        name: 'Secret',
        components: {Container, Draggable},
        data () {
            return {
                scene,
                upperDropPlaceholderOptions: {
                    className: 'cards-drop-preview',
                    animationDuration: '250',
                    showOnTop: true
                },
                dropPlaceholderOptions: {
                    className: 'drop-preview',
                    animationDuration: '250',
                    showOnTop: false
                },
                editing: false,
            }
        },
        computed: {
            local_user: function() {
                return localStorage.getItem('todo_user');
            }
        },
        methods: {
            detectAndCloseDropdown(event) {
                let target = event.target;
                
                if (!target.classList.contains('todo-action') && !target.classList.contains('todo-action-child')) {
                    let other_elements = this.$el.querySelectorAll('.todo-action')
                    for (var i = 0; i < other_elements.length; i++) {
                        other_elements[i].classList.remove('is-active')
                    }
                    
                }
            },
            unMarkDone(event, column, card) {
                let column_id = column.replace('column','');
                const scene = Object.assign({}, this.scene)
                console.log(scene)
                const column_new = scene.children.filter(p => 1)[0]
                
                const column_length = column_new.children.length
                
                
                let todoId = scene.children.filter(p => column_id)[1].children.findIndex(({id}) => id == card);
                const column_content = Object.assign({}, scene.children.filter(p => column_id)[1].children[todoId])
                let column_new_id = '0'+column_length
                
                scene.children.filter(p => column_id)[1].children.splice(todoId, 1)
                const undone_todo = { 
                    id: column_new_id,
                    type: 'draggable',
                    props: { className: 'card' }, 
                    data: { 
                        content: column_content.data.content, 
                        image: column_content.data.image,
                        editing: false,
                    }
                }
                column_new.children.unshift(undone_todo)
                localStorage.setItem('todos', JSON.stringify(scene));
                this.scene = scene
            },
            markDone(event, column, card) {
                console.log('move');

                let column_id = column.replace('column','');
                const scene = Object.assign({}, this.scene)
                const column_new = scene.children.filter(p => 1)[1]
                const column_length = column_new.children.length
                let todoId = scene.children.filter(p => column_id)[0].children.findIndex(({id}) => id == card);
                const column_content = Object.assign({}, scene.children.filter(p => column_id)[0].children[todoId])
                let column_new_id = '1'+column_length
                scene.children.filter(p => column_id)[0].children.splice(todoId, 1)
                
                const done_todo = { 
                    id: column_new_id,
                    type: 'draggable',
                    props: { className: 'card' }, 
                    data: { 
                        content: column_content.data.content, 
                        image: column_content.data.image,
                        editing: false,
                    }
                }
                column_new.children.unshift(done_todo)
                localStorage.setItem('todos', JSON.stringify(scene));
                this.scene = scene
            },
            removeImage(event, column, card) {
                event.preventDefault();
                const scene = Object.assign({}, this.scene)
                let column_id = column.replace('column','');

                let todoId = scene.children.filter(p => column_id)[0].children.findIndex(({id}) => id == card);
                scene.children.filter(p => column_id)[0].children[todoId].data.image = '';

                localStorage.setItem('todos', JSON.stringify(scene));
                this.scene = scene

            },
            editTodo(event, column, card) {
                event.preventDefault();

                const scene = Object.assign({}, this.scene)
                let column_id = column.replace('column','');

                let todoId = scene.children.filter(p => column_id)[0].children.findIndex(({id}) => id == card);
                scene.children.filter(p => column_id)[0].children[todoId].data.editing = true;

                localStorage.setItem('todos', JSON.stringify(scene));
                this.scene = scene

                this.editing = true

            },
            uploadImage(event) {
                event.preventDefault();

                const element = event.target;
                const todo = element.getAttribute('data-card');
                const scene = Object.assign({}, this.scene)
                let column_id = element.getAttribute('data-column').replace('column','');
                
                
                var reader = new FileReader();
                var file = event.target.files[0];
                var name = event.target.files[0].name;
                reader.addEventListener("load", function () {
                    if (this.result && localStorage && file.type.indexOf('image/') === 0) {
                        
                        
                        let todoId = scene.children.filter(p => column_id)[0].children.findIndex(({id}) => id == todo);
                        scene.children.filter(p => column_id)[0].children[todoId].data.image = this.result;

                        this.scene = scene
                        localStorage.setItem('todos', JSON.stringify(scene));
                        

                    } else {
                        alert('Browser doesnt support localStorage');
                    }
                });
                reader.readAsDataURL(event.target.files[0]);

                console.log(scene)
                
            },
            
            showTodoItemDrop (event) {
                
                let other_elements = this.$el.querySelectorAll('.todo-action')
                for (var i = 0; i < other_elements.length; i++) {
                    other_elements[i].classList.remove('is-active')
                }
                event.currentTarget.classList.toggle('is-active');
            },
            imageTodo (event, column, card) {
                event.preventDefault();
                this.$refs[card][0].click();
            },
            saveTodo (event, column, card) {
                let column_id = column.replace('column','');
                const scene = Object.assign({}, this.scene)
                let todoId = scene.children.filter(p => column_id)[0].children.findIndex(({id}) => id == card);

                                       
                if(!event.shiftKey && event.target.value.replace(/\n$/,"") != "") {
                    event.preventDefault();
                    event.target.value.replace(/\n$/,"")
                    if(event.target.value) {
                        scene.children.filter(p => column_id)[0].children[todoId].data.content = event.target.value;
                        this.editing = false
                        scene.children.filter(p => column_id)[0].children[todoId].data.editing = false
                        
                    }
                    
                } else {
                    if(event.target.parentElement.querySelector('textarea').value) {
                        event.target.parentElement.querySelector('textarea').value.replace(/\n$/,"")
                    
                        scene.children.filter(p => column_id)[0].children[todoId].data.content = event.target.parentElement.querySelector('textarea').value
                        this.editing = false
                        scene.children.filter(p => column_id)[0].children[todoId].data.editing = false
                        
                    } 
                    
                }
                
                localStorage.setItem('todos', JSON.stringify(scene));
                this.scene = scene
                

            },
            removeTodo(event, column, card) {
                event.preventDefault();

                let column_id = column.replace('column','');
                const scene = Object.assign({}, this.scene)
                scene.children.filter(p => column_id)[column_id].children.splice(scene.children.filter(p => column_id)[column_id].children.findIndex(({id}) => id == card), 1);

                localStorage.setItem('todos', JSON.stringify(scene));
                this.scene = scene
            },
            clearTodo (event, columnId) {
                let column_id = columnId.replace('column','');
                const scene = Object.assign({}, this.scene)
                //const column = scene.children.filter(p => column_id)[1]
                scene.children.filter(p => column_id)[1].children = []
                
                localStorage.setItem('todos', JSON.stringify(scene));
                this.scene = scene
            },
            newTodo (event, columnId) {
                
                let column_id = columnId.replace('column','');
                const scene = Object.assign({}, this.scene)
                const column = scene.children.filter(p => column_id)[0]
                const column_length = column.children.length
                
                const blank_todo = { 
                    id: column_id+(column_length+1),
                    type: 'draggable',
                    props: { className: 'card' }, 
                    data: { 
                        content: '', 
                        image: '',
                        editing: true,
                    }
                }

                column.children.unshift(blank_todo)
                localStorage.setItem('todos', JSON.stringify(scene));
                this.scene = scene
                this.editing = true
            },
            onColumnDrop (dropResult) {
                console.log(dropResult);
                const scene = Object.assign({}, this.scene)
                scene.children = applyDrag(scene.children, dropResult)
                this.scene = scene
                
            },
            onCardDrop (columnId, dropResult) {
                
                if (dropResult.removedIndex !== null || dropResult.addedIndex !== null) {
                    const scene = Object.assign({}, this.scene)
                    const column = scene.children.filter(p => p.id === columnId)[0]
                    const columnIndex = scene.children.indexOf(column)
                    const newColumn = Object.assign({}, column)
                    newColumn.children = applyDrag(newColumn.children, dropResult)
                    scene.children.splice(columnIndex, 1, newColumn)
                    this.scene = scene
                    localStorage.setItem('todos', JSON.stringify(scene));
                }
                
            },
            getCardPayload (columnId) {
                
                return index => {
                    return this.scene.children.filter(p => p.id === columnId)[0].children[index]
                }
                
            },
            dragStart () {
                // console.log('drag started')
            },
            log (...params) {
                // console.log(...params)
            },
            
        },
        
    }
</script>

<style scoped>
    #secure {
        display: flex;
        flex-wrap: wrap;
        width: 100%;
    }
    .inner-container {
        margin: 0px auto;
        max-width: 1000px;
        width: calc(100% - 30px);
    }
    #secure header {
        background: #f6f4f1;
        display: block;
        width: 100%;
    }

    #secure header .header-inner {
        display: flex;
        justify-content: space-between;
        align-items: center;
    }

    #secure header .header-inner .logo {
        width: 103px;
        padding-top: 2px;
    }
    #secure header .logo img {
        display: block;
        height: auto;
        width: 100%;
    }
    
    #secure header .menu {
        position: relative;
        padding-left: 38px;
        padding-right: 0px;
        transition: background .25s ease-in-out, padding-right .25s ease-in-out;
    }
    #secure header .menu.menu-active {
        background: #ccc;
        padding-right: 10px;
    }
    #secure header .menu label { 
        align-items: center;
        color: #534E45;
        cursor: pointer;
        display: flex;
        font-size: 14px;
        font-weight: 700; 
        padding-bottom: 13px;
        padding-top: 16px;
    }
    #secure header .menu label:after {
        background: #eae7dd url('../assets/avatar.png');
        background-position: center 5px;
        background-repeat: no-repeat;
        background-size: 24px auto;
        border: 1px solid #e6e2d7;
        border-radius: 50%;
        box-shadow: inset 3px 3px 3px #e6e2d7;
        content: " ";
        display: block;
        height: 44px;
        margin-left: 17px;
        width: 45px;
    }

    #secure header #menu {
        opacity: 0;
        -webkit-appearance:  none;
        position: absolute;
    }

    #secure header #nav {
        display: flex;
        flex-direction: column;
        max-height: 0px;
        overflow: hidden;
        position: absolute;
        transition: all .25s linear;
        width: 100%;
        left: 0px;
    }
    #secure header #nav a {
        color: #747474;
        background: #fff;
        border-bottom: 1px solid #dedede;
        display: flex;
        font-size: 12px;
        font-weight: 700;
        padding-top: 8px;
        padding-bottom: 8px;
        padding-left: 17px;
        position: relative;
        text-decoration: none;
        transition: background .25s linear;
    }
    #secure header #nav a:last-of-type {
        border-bottom: 0px none;
    }
    #secure header #nav a:hover {
        background: #dedede;
    }
    #nav a i {
        color: #c2c2c2;
        padding-right: 10px;
        transition: color .25s linear;
    }
    #nav a:hover i {
        color: #fff;
    }
    
    #secure header #menu:checked + #nav {
        max-height: 100vh;
        padding-bottom: 13px;
        padding-top: 8px;
        background: #fff;
        box-shadow: 0px 6px 17px 2px #dedede;
    }

    .page-description {
        padding-bottom: 14px;
        padding-top: 31px;
    }
    .page-description h2 {
        color: #322f29;
        font-size: 18px;
        font-weight: 700;
        line-height: 1em;
    }
    .page-description p {
        color: #aba493;
        font-size: 13px;
        font-weight: 700;
        line-height: 1.2em;
        letter-spacing: 0.01em;
        margin-top: 8px;
    }
    
    .card-scene {
        padding: 0px;
        padding-bottom: 7px;
        display: flex;
        width: calc(100% + 30px) !important;
        max-width: calc(1000px + 30px);
    }
    .card-scene .smooth-dnd-container:nth-of-type(1) {
        width: 50%;
    }
    .card-scene .smooth-dnd-container:nth-of-type(2) {
        width: 50%;
    }
    .card-scene .smooth-dnd-container .smooth-dnd-container {
        width: 100%;
    }

    .empty-msg { 
        color: #aba493;
        display: block; 
        font-size: 13px; 
        font-style: italic; 
        letter-spacing: 0.01em;
        padding: 16px 7px;
    }

    .smooth-dnd-container.horizontal {
        min-height: calc(100% - 120px);
        display: flex;
        align-items: stretch;
    }
    .smooth-dnd-container.vertical {
        min-height: calc(100% - 120px);
        display: flex;
        flex-direction: column;
    }
    

    .card-container {
        width: calc(100% - 30px);
        padding: 10px 20px;
        padding-bottom: 26px;
        margin: 15px;
        background-color: #f6f4f1;
        border-radius: 6px;
        min-height: calc(100vh - 200px)
        
    }

    .card {
        margin: 9px 7px;
        border: 1px solid #fff;
        background-color: white;
        border-radius: 8px;
        padding: 10px;
        padding-bottom: 20px;
    }
    .card img { 
        display: block;
        height: auto;
        padding-bottom: 15px;
        width: 100%;
    }

    .card .card-item-header {
        justify-content: space-between;
        display: flex;
        width: 100%;
        min-height: 25px;
    }

    .card .card-drag-handle {
        cursor: move;
        color: #666 !important;
    }

    .animated .card {
        background: rgba(255,255,255,0.35) !important;
        border: 1px dotted #ccc;
        opacity: 0.45;
        transition: background .45s linear, opacity .45s ease-in-out;
    }

    .card-column-header {
        border-bottom: 1px solid #eae8e0;
        color: #3f3b35;
        font-size: 18px;
        font-weight: 700;
        margin-bottom: 12px;
        padding-left: 7px;
        padding-right: 7px;
        padding-bottom: 12px;
        padding-top: 18px;
        display: flex;
        justify-content: space-between;
    }

    .card-column-header button,
    .card-column-header button:focus,
    .card-column-header button:active {
        border: 0px none;
        background: #e9e6e1;
        color: #787264;
        display: flex;
        height: 29px;
        width: 30px;
        justify-content: center;
        align-items: stretch;
        border-radius: 50%;
        position: relative;
        -webkit-appearance: none;
        -moz-appearance: none;
        outline: none;
        cursor: pointer;
        transition: background .45s linear, opacity .45s linear;
        opacity: 1;
    }
    
    
    .card-column-header button.todo-action:before {
        background: #736d61;
        border-bottom: 1px solid #ac9d90;
        border-top: 1px solid #ac9d90;
        content: " ";
        height: 1px;
        position: absolute;
        top: 13px;
        left: 9px;
        width: 12px;
        transition: background .45s linear;
    }
    .card-column-header button.todo-action:after {
        background: #736d61;
        border-left: 1px solid #ac9d90;
        border-right: 1px solid #ac9d90;
        content: " ";
        height: 12px;
        width: 1px;
        position: absolute;
        top: 8.5px;
        left: 14px;
        transition: background .45s linear;
    }
    .card-column-header button:hover {
        background: #736d61;
    }
    .card-column-header button:hover:before,
    .card-column-header button:hover:after {
        background: #736d61;
    }

    .card-column-header div { 
        position: relative; 
        top: -7px;
    } 

    .card-column-header button:disabled,
    .card-column-header button:disabled:hover {
        cursor: default;
        background: none;
        opacity: 0;
    }

    .card-column-header button.done-action {
        text-align: right;
        justify-content: space-between;
        align-items: center;
        border-radius: 0px;
        background: none;
        margin-right: -3px;
    }
    
    

    .card-ghost {
        transition: all 0.18s ease;
        border: 1px dashed #ccc;
        color: #fff;
        max-height: 36px;
        max-width: 72px;
        overflow: hidden;
    }
    .card-ghost .todo-action { 
        display: none; 
        opacity: 0;
    }
    .card-ghost .todo-checkbox { 
        display: none; 
        opacity: 0;
    }

    .card-ghost-drop {
        transition: transform 0.18s ease-in-out;
        background: #666 !important;
        color: #000;
        max-height: 100vh;
        max-width: 72vw;
    }

    .opacity-ghost {
        transition: all .18s ease;
        opacity: 0.8;
        /* transform: rotateZ(5deg); */
        background-color: cornflowerblue;
        box-shadow: 3px 3px 10px 3px rgba(0, 0, 0, 0.3);
    }

    .opacity-ghost-drop {
        opacity: 1;
        /* transform: rotateZ(0deg); */
        background-color: white;
        box-shadow: 3px 3px 10px 3px rgba(0, 0, 0, 0.0);
    }

    .card .checkbox {
        color: #666;
        cursor: pointer;
    }

    .card button.todo-action,
    .card button.todo-action:focus,
    .card button.todo-action:active {
        background: none;
        border: 0px none;
        color: #6a6a6a;
        cursor: pointer;
        display: flex;
        flex-direction: column;
        margin-right: -7px;
        -webkit-appearance: none;
        -moz-appearance: none;
        outline: none;
    }
    .card button.todo-action i {
        line-height: 5px;
        font-size: 22px;
        font-family: Tahoma;
    }

    .card .todo-dropdown {
        background: none;
        border-radius: 6px;
        max-height: 0px;
        margin-top: 10px;
        overflow: hidden;
        position: absolute;
        transition: none;
    }
    .card .todo-dropdown li {
        border-bottom: 1px solid #f4f1e6;
        max-height: 0px;
        padding-bottom: 3px;
        transition: none;
    }
    .card .todo-dropdown li:last-child {
        border-bottom: 0px none;
    }
    .card .todo-dropdown li a {
        color: #837c6c;
        font-size: 12px;
        font-weight: 700;
        display: block;
        line-height: 38px;
        min-height: 35px;
        padding-left: 12px;
        padding-top: 2px;
        position: relative;
        text-indent: 25px;
        text-decoration: none;
    }
    .card .todo-dropdown li:first-child a {
        line-height: 35px;
        padding-top: 0px;
    }
    .card .todo-dropdown li a:before {
        font-family: "Font Awesome 5 Free";
        font-size: 15px;
        position: absolute;   
        left: -12px; 
    }
    .card .todo-dropdown li.item-delete a:before {
        content: "\f2ed";
    }
    .card .todo-dropdown li.item-edit a:before {
        content: "\f044";
    }
    .card .todo-dropdown li.item-image-add a:before {
        content: "\f03e";
    }
    .card .todo-dropdown li.item-image-change a:before {
        content: "\f03e";
    }
    

    .card button.todo-action.is-active + .todo-dropdown {
        border-top: 1px solid #f5f5f5;
        display: block;
        padding-bottom: 0px;
        padding-top: 4px;
        overflow: inherit;
        right: 15px;
        background: #fff;
        box-shadow: 0px 6px 17px 2px #dedede;
        max-height: 100vh;
        width: 169px;
        z-index: 20;
        transition: max-height .45s ease-in-out, box-shadow .45s ease-in-out;
    }
    .card button.todo-action.is-active + .todo-dropdown li {
        max-height: 100vh;
        transition: max-height .45s ease-in-out;
    }

    .card p { font-size: 13px; font-weight: 700; }
    .todo-content-edit { 
        display: block; 
    }
    .card textarea { 
        background: #f6f4f1;
        border: 1px dotted #ccc; 
        display: block;
        font-family: 'Nunito Sans', sans-serif; 
        font-size: 13px; 
        min-height: 43px;
        padding: 10px;
        resize: vertical; 
        width: 100%;
    }
    .card textarea + button {
        background: #ccc;
        border: 0px none;
        display: block;
        padding-top: 7px;
        padding-bottom: 9px;
        padding-left: 10px;
        width: 100%;
        border-bottom-left-radius: 3px;
        border-bottom-left-radius: 3px;
        cursor: pointer;
    }

    .todo-image {
        position: relative;
    }

    @media only screen and (max-width: 640px) {
        #secure header .header-inner {
            padding-bottom: 10px;
            padding-top: 10px;
        }
        #secure header .header-inner .logo {
            padding-top: 0px;
        }
        
        #secure header .menu {
            padding-left: 38px;
            position: absolute;
            right: 10px;
            top: -18px;
            transition: none;
        }

        #secure header .menu.menu-active {
            background: #fff;
            padding-right: 10px;
            padding-left: 23px;
            position: fixed;
            top: 0px;
            left: 36px;
            height: 100%;
            width: calc(100% - 36px);
            z-index: 10;
        }
        #secure header .menu.menu-active:before {
            background: rgba(0,0,0,0.45);
            content: " ";
            display: block;
            height: 100%;
            position: absolute;
            left: -36px;
            width: 36px;
        }
        #secure header .menu label { 
            font-size: 16px;
            font-weight: 700; 
            padding-bottom: 0px;
            padding-top: 27px;
            padding-right: 10px;
        }
        #secure header .menu label span {
            display: none;
            order: 2;
        }
        #secure header .menu.menu-active label span {
            display: block;
            padding-left: 21px;
        }

        #secure header .menu label:after {
            background-position: center 4.5px;
            background-size: 15px auto;
            height: 31px;
            margin-left: 0px;
            width: 32px;
            order: 1;
        }
        #secure header .menu.menu-active label:after {
            background-position: center 5px;
            background-size: 24px auto;
            height: 44px;
            margin-left: 0px;
            width: 45px;
            order: 1;
            position: relative;
            top: -5px;
        }

        #secure header .menu.menu-active label:before {
            content: "X";
            color: #c2c2c2;
            display: block;
            height: 32px;
            line-height: 31px;
            border: 1px solid #c2c2c2;
            border-radius: 50%;
            margin-left: auto;
            order: 3;
            text-align: center;
            width: 32px;
            transition: all .35s linear;
        }
        #secure header .menu.menu-active label:hover:before {
            color: #747474;
            border: 1px solid #747474;
            
        }

        #secure header #menu {
            opacity: 0;
            -webkit-appearance:  none;
            position: absolute;
        }

        #secure header #nav {
            display: flex;
            flex-direction: column;
            max-height: 0px;
            overflow: hidden;
            position: absolute;
            transition: height .25s linear;
            width: 100%;
            left: 0px;
        }
        #secure header #nav a {
            color: #747474;
            display: flex;
            font-size: 12px;
            font-weight: 700;
            justify-content: center;
            padding-bottom: 15px;
            padding-top: 15px;
            position: relative;
            text-decoration: none;
            width: 100%;
        }
        
        
        #secure header #menu:checked + #nav {
            align-items: center;
            max-height: 100vh;
            padding-bottom: 10px;
            padding-top: 8px;
            background: #fff;
            border-top: 1px solid #f2efe3;
            box-shadow: none;
            bottom: 0px;
        }

        .page-description {
            padding-bottom: 13px;
            padding-top: 27px;
        }
        .page-description h2 {
            font-size: 17px;
        }
        .page-description p {
            font-size: 12px;
            font-weight: 500;
            line-height: 1.1em;
            margin-top: 4px;
        }

        .card-scene {
            flex-direction: column;
        }
        .card-scene .smooth-dnd-container:nth-of-type(1) {
            width: 100%;
        }
        .card-scene .smooth-dnd-container:nth-of-type(2) {
            width: 100%;
        }

        .smooth-dnd-container.horizontal {
            min-height: inherit;
        }
        .smooth-dnd-container.vertical {
            min-height: inherit;
        }
        

        .card-container {
            width: calc(100% - 30px);
            padding: 10px 12px;
            padding-bottom: 26px;
            margin: 10px 15px;
            border-radius: 4px;
            min-height: inherit;
            
        }

        .card {
            margin: 7px 3px;
            border: 1px solid #fff;
            background-color: white;
            border-radius: 8px;
            padding: 10px;
        }

        .card-column-header {
            font-size: 17px;
            margin-bottom: 11px;
            padding-left: 7px;
            padding-right: 7px;
            padding-bottom: 21px;
            padding-top: 12px;
        }
    }
    
</style>