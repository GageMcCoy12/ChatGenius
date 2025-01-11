import { prisma } from '../prisma';

/**
 * Service class for handling message-related database operations
 */
export class MessageService {
  /**
   * Fetches messages for a specific channel
   * @param channelId - The ID of the channel to fetch messages from
   * @param options - Query options for pagination and ordering
   * @returns Promise containing the messages with user and reaction data
   */
  static async getChannelMessages(
    channelId: string,
    options: {
      limit?: number;
      cursor?: string;
      orderBy?: 'asc' | 'desc';
    } = {}
  ) {
    const { limit = 50, cursor, orderBy = 'desc' } = options;

    const messages = await prisma.message.findMany({
      where: {
        channelId,
        replyToId: null, // Only fetch top-level messages
      },
      take: limit,
      skip: cursor ? 1 : 0,
      cursor: cursor ? { id: cursor } : undefined,
      orderBy: {
        createdAt: orderBy,
      },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            imageUrl: true,
            isOnline: true,
          },
        },
        reactions: {
          include: {
            user: {
              select: {
                id: true,
                username: true,
                imageUrl: true,
              },
            },
          },
        },
        replies: {
          take: 1,
          orderBy: {
            createdAt: 'desc',
          },
        },
      },
    });

    const nextCursor = messages[limit - 1]?.id;

    return {
      messages,
      nextCursor,
    };
  }

  /**
   * Fetches a single message by its ID
   * @param messageId - The ID of the message to fetch
   * @returns Promise containing the message with user and reaction data
   */
  static async getMessage(messageId: string) {
    return prisma.message.findUnique({
      where: { id: messageId },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            imageUrl: true,
            isOnline: true,
          },
        },
        reactions: {
          include: {
            user: {
              select: {
                id: true,
                username: true,
                imageUrl: true,
              },
            },
          },
        },
        replies: true,
      },
    });
  }

  /**
   * Fetches thread messages for a parent message
   * @param parentMessageId - The ID of the parent message
   * @param options - Query options for pagination and ordering
   * @returns Promise containing the thread messages
   */
  static async getThreadMessages(
    parentMessageId: string,
    options: {
      limit?: number;
      cursor?: string;
      orderBy?: 'asc' | 'desc';
    } = {}
  ) {
    const { limit = 50, cursor, orderBy = 'asc' } = options;

    const messages = await prisma.message.findMany({
      where: {
        replyToId: parentMessageId,
      },
      take: limit,
      skip: cursor ? 1 : 0,
      cursor: cursor ? { id: cursor } : undefined,
      orderBy: {
        createdAt: orderBy,
      },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            imageUrl: true,
            isOnline: true,
          },
        },
        reactions: {
          include: {
            user: {
              select: {
                id: true,
                username: true,
                imageUrl: true,
              },
            },
          },
        },
      },
    });

    const nextCursor = messages[limit - 1]?.id;

    return {
      messages,
      nextCursor,
    };
  }
} 