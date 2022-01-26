class TreeWillBreak(Exception):
    """
    Basically a warning raised when an action is being taken that will break a hierarchy/tree
    """


class NodesWillBeOrphaned(TreeWillBreak):
    """
    An action on a tree node will orphan its descendants
    """

class ParentIsSame(ValueError):
    """The new parent is the same as the old parent"""

class NodeIsSame(ValueError):
    """The provided node is equal"""
