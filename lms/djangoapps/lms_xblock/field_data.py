"""
:class:`~xblock.field_data.FieldData` subclasses used by the LMS
"""

from xblock.field_data import ReadOnlyFieldData, SplitFieldData
from xblock.fields import Scope, RemoteScope
from xblock.runtime import KeyValueStore

from courseware.model_data import FieldDataCache


class LmsFieldData(SplitFieldData):
    """
    A :class:`~xblock.field_data.FieldData` that
    reads all UserScope.ONE and UserScope.ALL fields from `student_data`
    and all UserScope.NONE fields from `authored_data`. It also prevents
    writing to `authored_data`.
    """
    def __init__(self, authored_data, student_data, shared_data=None):
        # Make sure that we don't repeatedly nest LmsFieldData instances
        if isinstance(authored_data, LmsFieldData):
            authored_data = authored_data._authored_data  # pylint: disable=protected-access
        else:
            authored_data = ReadOnlyFieldData(authored_data)

        self._authored_data = authored_data
        self._student_data = student_data

        super(LmsFieldData, self).__init__({
            Scope.content: authored_data,
            Scope.settings: authored_data,
            Scope.parent: authored_data,
            Scope.children: authored_data,
            Scope.user_state_summary: student_data,
            Scope.user_state: student_data,
            Scope.user_info: student_data,
            Scope.preferences: student_data,
            RemoteScope.user_state: student_data
        })

    def __repr__(self):
        return "LmsFieldData{!r}".format((self._authored_data, self._student_data))

    def _shared_field_data(self, remote_scope):
        """Summary
        
        Args:
            remote_scope (TYPE): Description
        
        Returns:
            TYPE: Description
        """
        return self._find_scope_in_mapping(remote_scope)

    def _find_scope_in_mapping(self, scope):
        return self._scope_mappings[scope]

    def get(self, block, name):
        queryable = block.fields[name].queryable
        if queryable is None:
            return self._field_data(block, name).get(block, name)
        else:
            field_data_cache = self._shared_field_data(queryable.remote_scope)
            try:
                return field_data_cache.get(block, name)
            except TypeError:
                raise TypeError
