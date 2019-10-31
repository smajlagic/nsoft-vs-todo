<template>
    
    <div id="secure" @click="detectAndCloseDropdown($event)">
        <header>
            <div class="header-inner inner-container">
                <router-link to="/home" class="logo"><img src="../assets/logo.png"></router-link>

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
                        <div class="todo-image" v-if="card.data.image">
                            <img :src="card.data.image">
                        </div>

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

        props: {
            listId: [String, Number],
            placeholder: String,
            icon: {
            type: String,
            default: 'angle-right'
            }
        },

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
                const column_new = scene.children.filter(p => 1)[0]
                let todoId = scene.children.filter(p => column_id)[1].children.findIndex(({id}) => id == card);
                const column_content = Object.assign({}, scene.children.filter(p => column_id)[1].children[todoId])
                let randomId = Math.random().toString(36).substring(7)
                let column_new_id = randomId
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
                localStorage.setItem('todos', JSON.stringify(scene))
                this.scene = scene
            },
            markDone(event, column, card) {
                let column_id = column.replace('column','');
                const scene = Object.assign({}, this.scene)
                const column_new = scene.children.filter(p => 1)[1]
                const column_length = column_new.children.length
                let todoId = scene.children.filter(p => column_id)[0].children.findIndex(({id}) => id == card);
                const column_content = Object.assign({}, scene.children.filter(p => column_id)[0].children[todoId])
                let randomId = Math.random().toString(36).substring(7)
                let column_new_id = randomId
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
                this.editing = true
                const scene = Object.assign({}, this.scene)
                let column_id = column.replace('column','');
                let todoId = scene.children.filter(p => column_id)[0].children.findIndex(({id}) => id == card);
                scene.children.filter(p => column_id)[0].children[todoId].data.editing = true;
                localStorage.setItem('todos', JSON.stringify(scene));
                this.scene = scene
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

                reader.readAsDataURL(event.target.files[0]);
                reader.addEventListener("load", function () {


                    if (this.result && localStorage && file.type.indexOf('image/') === 0) {
                        let todoId = scene.children.filter(p => column_id)[0].children.findIndex(({id}) => id == todo);
                        scene.children.filter(p => column_id)[0].children[todoId].data.image = this.result;
                        this.scene = scene
                        localStorage.setItem('todos', JSON.stringify(scene));
                    } 
                });
                



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
                scene.children.filter(p => column_id)[1].children = []
                localStorage.setItem('todos', JSON.stringify(scene));
                this.scene = scene
            },
            newTodo (event, columnId) {
                this.editing = true
                
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
            },
            onColumnDrop (dropResult) {
                const scene = Object.assign({}, this.scene)
                scene.children = applyDrag(scene.children, dropResult)
                localStorage.setItem('todos', JSON.stringify(scene));
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
                    
                    localStorage.setItem('todos', JSON.stringify(scene));
                    this.scene = scene
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