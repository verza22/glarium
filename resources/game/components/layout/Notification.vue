<template>
    <div>
        <div class="noti" v-for='(notification,index) in notifications' :key='index' :class="getClass(notification)">
            <div class="top"></div>
            <div class="center">{{notification.message}}</div>
            <div class="bottom"></div>
            <div class="icon"></div>
        </div>
    </div>
</template>

<script>
export default {
    name:'Notification',
    data(){
        return {
            advisor:1,
            type:true,
            message:'',
            notifications:[]
        }
    },
    methods:{
        setNotification({advisor,type,message,time = 5000}){
            var notify = {
                advisor:advisor,
                type:type,
                message:message,
                status:true
            }
            var index = this.notifications.push(notify) - 1;
            setTimeout(this.hidden, time, index);
        },
        getClass(notification){
            var classes = [];
            classes.push(notification.type ? 'noti-green' : 'noti-red');
            classes.push(notification.status ? '' : 'inactive');
            switch(notification.advisor){
                case 1:
                    classes.push('noti-mayor');
                break;
                case 2:
                    classes.push('noti-general');
                break;
                case 3:
                    classes.push('noti-scientist');
                break;
                case 4:
                    classes.push('noti-diplomat');
                break;
            }
            return classes;
        },
        hidden(index){
            this.notifications[index].status = false;
            setTimeout(this.remove, 1000, index);
        },
        remove(index){
            this.notifications.splice(index,1);
        }
    },
    beforeMount(){
        this.setNotification({
            advisor:1,
            type:true,
            message:'Hola prueba'
        })
        this.setNotification({
            advisor:2,
            type:true,
            message:'Hola prueba',
            time:2000
        })
    }
}
</script>

<style lang="scss" scoped>

.noti-mayor{
    top: 77px;
    right: 330px;
}
.noti-general{
    top: 72px;
    right: 237px;
}
.noti-scientist{
    top: 72px;
    right: 150px;
}
.noti-diplomat{
    top: 78px;
    right: 60px;
}
.noti{
    position: absolute;
    color: #542c0f;
    width: 200px;
    text-align: center;
    font-size: 0.83rem;
    line-height: 0.83rem;
    opacity: 0.9;
    transition: all 1s linear;
}
.inactive{
    opacity: 0;
}
.noti .top{
    background-repeat: no-repeat;
    background-position-y: top;
    padding: 25px 10px 0;
}
.noti-red .top,.noti-red .center,.noti-red .bottom{
    background-image: url('~Img/icon/bubble_red.png');
}
.noti-green .top,.noti-green .center,.noti-green .bottom{
    background-image: url('~Img/icon/bubble_green.png');
}
.noti .center{
    background-repeat: repeat-y;
    background-position: center;
    padding: 0px 10px;
}
.noti .bottom {
    padding: 4px;
    background-repeat: no-repeat;
    background-position: bottom;
}
.noti .icon{
    width: 30px;
    height: 30px;
    position: absolute;
    top: 15px;
    right: -15px;
}
.noti-red .icon{
    background-image: url('~Img/icon/cross.png');
}
.noti-green .icon{
    background-image: url('~Img/icon/check_mark.png');
}
</style>
