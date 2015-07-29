"""
Provides partition support to the user service.
"""
import logging

log = logging.getLogger(__name__)


class VerificationPartitionScheme(object):
    """
    This scheme randomly assigns users into the partition's groups.
    """
    NON_VERIFIED_GROUP = 'non_verified_group'
    VERIFIED_ALLOW_GROUP = 'verified_allow_group'
    VERIFIED_DENY_GROUP = 'verified_deny_group'


    @classmethod
    def get_group_for_user(cls, course_key, user, user_partition):
        checkpoint = user_partition.parameters["location"]

        if (
            not cls._is_enrolled_in_verified_mode(user, course_key) or
            cls._was_denied_at_any_checkpoint(user, course_key)
        ):
            return cls.NON_VERIFIED_GROUP
        elif (
            cls._has_skipped_any_checkpoint(user, course_key) or
            cls._has_completed_checkpoint(user, course_key, checkpoint)
        ):
            return cls.VERIFIED_ALLOW_GROUP
        else:
            return cls.VERIFIED_DENY_GROUP


    @classmethod
    def key_for_partition(cls, xblock_location_id):
        """
        Returns the key to use to look up and save the user's group for a given user partition.
        """
        return 'incourse.verification.partition_{0}'.format(xblock_location_id)

    def _is_enrolled_in_verified_mode(self, user, course_key):
        pass

    def _was_denied_at_any_checkpoint(self, user, course_key):
        pass

    def _has_skipped_any_checkpoint(self, user, course_key):
        pass

    def _has_completed_checkpoint(self, user, course_key, checkpoint):
        pass