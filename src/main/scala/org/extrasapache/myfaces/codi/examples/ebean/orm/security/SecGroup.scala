package org.extrasapache.myfaces.codi.examples.ebean.orm.security

import java.io.Serializable
import javax.persistence._
import reflect.BeanProperty
import org.extrasapache.myfaces.codi.examples.ebean.support.data.StdEntity

/**
 *
 * @author Werner Punz (latest modification by $Author$)
 * @version $Revision$ $Date$
 */
object SecGroupConst {
  val GRP_TYPE_SYSTEM = 0
  val GRP_TYPE_USER = 1
  val GRP_TYPE_OTHER = 2
}

@Entity
@Table(name = "o_secgroup")
class SecGroup extends Serializable with StdEntity {

  @BeanProperty
  protected var groupType: java.lang.Integer = SecGroupConst.GRP_TYPE_SYSTEM

  @BeanProperty
  protected var groupName: String = _

  @BeanProperty
  protected var description: String = _

  @ManyToMany(fetch = FetchType.LAZY, cascade = Array(CascadeType.MERGE, CascadeType.REFRESH))
  @BeanProperty
  protected var credentialOwners: java.util.List[User] = _
}
