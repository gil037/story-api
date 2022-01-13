import { Story } from '@Domains/stories/entities';
import { StoryRepository } from '@Domains/stories/repository';
import { UserRepository } from '@Domains/users/repository';
import AuthenticationError from '@Commons/exceptions/AuthenticationError';
import { ApplicationUseCase, UseCaseDependencies } from '@Applications/usecase/base';

type UseCasePayload = {
  userId: string;
  page: number;
  size: number;
}

class GetAllStoriesUseCase extends ApplicationUseCase<UseCasePayload, Story[]> {
  private storyRepository: StoryRepository;

  private userRepository: UserRepository;

  constructor(useCaseDependencies: UseCaseDependencies) {
    super(useCaseDependencies);
    const { storyRepository, userRepository } = useCaseDependencies;
    this.storyRepository = storyRepository;
    this.userRepository = userRepository;
  }

  protected async run({ userId, page, size }: UseCasePayload): Promise<Story[]> {
    const user = await this.userRepository.findById(userId);

    if (!user) {
      throw new AuthenticationError('User not found');
    }

    return this.storyRepository.getStoriesWithPaging(page, size);
  }
}

export default GetAllStoriesUseCase;
