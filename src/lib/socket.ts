import { env } from '@/env'
import { io } from 'socket.io-client'

const socket = io(env.WPP_URL_SOCKET)

export default socket
