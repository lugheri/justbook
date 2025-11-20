import { FastifyReply, FastifyRequest } from 'fastify'
import z from 'zod'
import { UserPartialDTO } from '../@dtos/UserDTO'
import { UserUseCaseFactory } from '../usecases/factories/user-usecases.factory'
export const updateUser = async (
  request: FastifyRequest,
  reply: FastifyReply,
) => {
  try {
    const params = z.object({ user_id: z.coerce.number() })
    const { user_id } = params.parse(request.params)
    const user_data = UserPartialDTO.parse(request.body)

    const { userUpdated } = await UserUseCaseFactory.updateUser().execute({
      user_id,
      user_data,
    })
    reply.status(200).send(userUpdated)
  } catch (err) {
    console.log(err)
    throw err
  }
}
