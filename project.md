# BANCO DE DADOS #

USER
- email: string
- socket_id: string
- name: string
- avatar: string

MESSAGE
- to: ObjectId
- text: string
- roomId: string
- created_at: Date

CHATROOM
- idUsers: Array<USER>
- idChatRoom: string
